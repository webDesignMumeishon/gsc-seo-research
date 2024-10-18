'use server'

import { google } from 'googleapis'
import { revalidateTag } from 'next/cache';
import { auth } from '@clerk/nextjs/server'

import { oauth2Client } from '@/lib/oauth2-client';
import { GetUserToken, GetUserTokenByTokenId } from './token';
import SiteService from '@/services/sites';
import { SITES_LIST_CACHE_TAG } from '@/utils';
import { Site } from '@/types/site';
import GoogleSearchConsoleService, { YYYYMMDD } from '@/services/google-search-console';
import { GraphMetrics, GoogleDataRow } from '@/types/googleapi';
import prisma from '@/lib/prisma';
import moment from 'moment';

const startDate = '2024-06-01';
const endDate = '2024-09-13';
const rowLimit = 5000;


export const PagesQueryCount = async (userId: string, page: string, siteUrl: string) => {
    const token = await GetUserToken(userId, siteUrl)

    oauth2Client.setCredentials({
        access_token: token?.access_token,
        refresh_token: token?.refresh_token
    })
    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    const response = await webmasters.searchanalytics.query({
        siteUrl: page,
        requestBody: {
            startDate,
            endDate,
            dimensions: ['page', 'query'],
            rowLimit,
            dimensionFilterGroups: [],
        },
    });

    const pageQueryCounts = response?.data?.rows?.reduce((acc: any, row: any) => {
        const [page, query] = row.keys;
        if (!acc[page]) {
            acc[page] = new Set();
        }
        acc[page].add(query);  // Add query to the set for the page
        return acc;
    }, {});

    if (pageQueryCounts === undefined) {
        return []
    }

    // Transform the results into the desired format
    const result = Object.entries(pageQueryCounts).map(([page, queries]: any[], index: number) => ({
        id: index,
        page,
        numberOfQueries: queries.size  // The size of the set gives the number of unique queries
    }));

    return result
}

export const GetSiteMetrics = async (userId: string, siteUrl: string): Promise<GraphMetrics[]> => {
    const token = await GetUserToken(userId, siteUrl)

    oauth2Client.setCredentials({
        access_token: token?.access_token,
        refresh_token: token?.refresh_token,
    })


    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    const response = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
            startDate,
            endDate,
            dimensions: ['date'],
            rowLimit,
            dimensionFilterGroups: [],
        },
    });

    try {
        const result = response.data.rows?.reduce<{ [key: string]: GoogleDataRow }>((acc, curr) => {
            const dayKey = curr?.keys?.[0] as string
            const clicks = curr.clicks || 0
            const ctr = (curr.ctr! * 100) || 0
            const impressions = curr.impressions || 0
            const position = curr.position || 0

            if (!acc[dayKey]) {
                acc[dayKey] = {
                    clicks,
                    ctr,
                    impressions,
                    position,
                }
            }

            return acc
        }, {})

        if (result === undefined) {
            return []
        }
        else {
            return Object.keys(result).map(row => ({ date: row, ...result[row] }))
        }
    } catch (error) {
        console.log(error)
        return []
    }



}

export const GetPagesMetrics = async (userId: string, siteUrl: string, startDate: Date, endDate: Date) => {
    const token = await GetUserToken(userId, siteUrl)

    const console = new GoogleSearchConsoleService(token.access_token, token.refresh_token)

    return console.getPagesMetrics(siteUrl, moment(startDate).format('YYYY-MM-DD') as YYYYMMDD, moment(endDate).format('YYYY-MM-DD') as YYYYMMDD)
}

export const GetQueriesByPage = async (url: string, pageUrl: string, startDate: Date, endDate: Date) => {
    const { userId } = auth()

    if (userId === null) {
        throw new Error('Missing userId')
    }

    const token = await GetUserToken(userId)

    const console = new GoogleSearchConsoleService(token.access_token, token.refresh_token)

    return await console.getQueriesByPage(url, pageUrl, startDate, endDate)
}

export const GetSitesGoogle = async (subId: string, userId: string): Promise<Site[]> => {

    const token = await prisma.token.findFirst({
        where: {
            subId
        }
    })

    try {
        oauth2Client.setCredentials({
            access_token: token?.access_token,
            refresh_token: token?.refresh_token
        })

        const webmasters = google.webmasters({
            version: 'v3',
            auth: oauth2Client,
        });

        const response = await webmasters.sites.list();
        const sites = response.data.siteEntry;

        const dbSites = await SiteService.getUserSites(userId)

        const urlsInDb = new Set(dbSites.map(item => item.url));

        const filteredSites = sites?.filter(item => !urlsInDb.has(item?.siteUrl as string));

        return filteredSites?.map((site, id) => {
            return {
                id: id,
                url: site.siteUrl || '',
                permission: site.permissionLevel || ''
            }
        }) ?? []
    } catch (error) {
        console.log(error)
        return []
    }
}

export const saveUserSites = async (subId: string, userId: string, sites: Site[]) => {
    const token = await GetUserTokenByTokenId(subId)

    oauth2Client.setCredentials({ access_token: token.access_token, refresh_token: token.refresh_token })

    try {
        const sitesCreated = await SiteService.saveSites(userId, token.id, sites)
        revalidateTag(SITES_LIST_CACHE_TAG)
        return sitesCreated
    } catch (error) {
        console.log(error)
    }
}

export const GetQueries = async (userId: string, siteUrl: string): Promise<{ month: string; impressions: any; clicks: any }[]> => {
    const token = await GetUserToken(userId)

    oauth2Client.setCredentials({
        access_token: token?.access_token,
        refresh_token: token?.refresh_token
    })

    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    // Define the request body
    const request = {
        startDate: '2024-01-01', // Adjust start date
        endDate: '2024-08-31', // Adjust end date
        dimensions: ['query', 'date'], // Add 'date' to group by date
        searchType: 'web', // Type of search data (web, image, video)
        rowLimit: 25000 // Adjust if needed
    };

    try {
        const response = await webmasters.searchanalytics.query({
            siteUrl: siteUrl,
            requestBody: request
        });

        const rows = response.data.rows || [];

        // Group by month
        const monthlyData = rows.reduce((acc: any, row) => {
            // const query = row?.keys?.[0]; // The search query
            const date = row?.keys?.[1]; // The date
            const impressions = row.impressions;
            const clicks = row.clicks;

            const month = date?.slice(0, 7); // Extract 'YYYY-MM' from 'YYYY-MM-DD'

            if (!acc[month as string]) {
                acc[month as string] = { impressions: 0, clicks: 0 };
            }

            acc[month as string].impressions += impressions;
            acc[month as string].clicks += clicks;

            return acc;
        }, {});

        const result = []

        for (const element in monthlyData) {
            result.push({ month: element, impressions: monthlyData[element].impressions, clicks: monthlyData[element].clicks })
        }

        result.sort((a, b) => {
            return a.month.localeCompare(b.month);
        });
        return result;

    } catch (error) {
        console.error('Error fetching search analytics:', error);
        return []
    }
}