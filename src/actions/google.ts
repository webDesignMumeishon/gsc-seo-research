'use server'

import { oauth2Client } from '@/lib/oauth2-client';
import { google } from 'googleapis'
import { revalidateTag, unstable_cache } from 'next/cache';
import { GetUserToken } from './token';
import prisma from "@/lib/prisma";
import SiteService from '@/services/sites';
import { GetSites } from './sites';
import { SITES_LIST_CACHE_TAG, USER_ID } from '@/utils';
import { Site } from '@/types/site';
import GoogleSearchConsoleService from '@/services/google-search-console';

const startDate = '2024-06-01';
const endDate = '2024-09-13';
const rowLimit = 5000;


export const   GetPagesList = async (page: string, userId: number) => {
    const token = await GetUserToken(userId)

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
            dimensions: ['page', 'query'], // Request data for each page
            rowLimit, // Maximum number of rows to retrieve
            dimensionFilterGroups: [],  // No filters to get all data

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

export const GetPagesListCache = unstable_cache(
    async (page: string, userId: number) => {
        return await GetPagesList(page, userId);
    },
    ['pages-list'],
    { revalidate: 86400 } // 86400 seconds = 1 day
);

export const GetQueriesByPage = async (url: string, pageUrl: string, startDate: Date, endDate: Date) => {
    const token = await GetUserToken(USER_ID)

    const console = new GoogleSearchConsoleService(token.access_token, token.refresh_token)

    return await console.getQueriesByPage(url, pageUrl, startDate, endDate)
}

export const GetSitesGoogle = async (accessToken: string, refreshToken: string, userId: number): Promise<Site[]> => {
    try {
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
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

export const saveUserSites = async (accessToken: string, refreshToken: string, userId: number, sites: Site[]) => {
    oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
    });

    try {
        const userInfo = await oauth2.userinfo.get();

        const token = await prisma.token.upsert({
            where: {
                userId_accountId: {
                    userId: userId,
                    accountId: userInfo.data.id || ''
                },
            },
            update: {}, // No update needed
            create: {
                access_token: accessToken,
                refresh_token: refreshToken,
                userId: userId,
                accountId: userInfo.data.id || ''
            }
        });

        const sitesCreated = await Promise.all(sites.map(async site => {
            return prisma.site.create({
                data: {
                    url: site.url,
                    permission: site.permission,
                    userId: userId,
                    tokenId: token.id
                },
                select: {
                    id: true,
                    url: true,
                    permission: true,
                },
            })
        }))
        revalidateTag(SITES_LIST_CACHE_TAG)
        return sitesCreated
    } catch (error) {
        console.log(error)
    }


}

export const GetSitesCache = unstable_cache(
    async (userId: number) => {
        return await GetSites(userId);
    },
    ['sites-list'],
    { tags: [SITES_LIST_CACHE_TAG], revalidate: 86400 } // 86400 seconds = 1 day
);

export const GetQueries = async (userId: number, siteUrl: string): Promise<{ month: string; impressions: any; clicks: any }[]> => {
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
            const query = row?.keys?.[0]; // The search query
            const date = row?.keys?.[1]; // The date
            const impressions = row.impressions;
            const clicks = row.clicks;

            const month = date?.slice(0, 7); // Extract 'YYYY-MM' from 'YYYY-MM-DD'

            if (!acc[month]) {
                acc[month] = { impressions: 0, clicks: 0 };
            }

            acc[month].impressions += impressions;
            acc[month].clicks += clicks;

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