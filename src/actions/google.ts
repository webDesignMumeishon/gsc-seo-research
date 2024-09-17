'use server'

import { oauth2Client } from '@/lib/oauth2-client';
import { google } from 'googleapis'
import { unstable_cache } from 'next/cache';
import { GetUserToken } from './token';

const startDate = '2024-06-01';
const endDate = '2024-09-13';
const rowLimit = 5000;

export const GetPagesList = async (page: string) => {
    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612yWfIYNaZELBGaawA6jwcMViLw-WybNCla7LICVo1lvblXyxl7dr0o_xcbIOhPbKaxuFSmRQ6a5s_RtB1LQEhABiB8YWW74jYoSP2cZu1UvxwX9n6g5TOYfK4eo_1kysVkkg9s8DcdhSe6awoLesPOMh39ItDFwBxwmaCgYKAY0SARISFQHGX2MiCw1NsxEnGFx07H-mL82gFQ0175',
        refresh_token: '1//0htOaMw2GQIf9CgYIARAAGBESNwF-L9IrCsG3XmwJoGuG7HlUITL8l1jji9X22HvsdmKHyU6KykA3Jc3xvbf8SmWaefg9nAemHQc'
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
    async (page: string) => {
        return await GetPagesList(page);
    },
    ['pages-list'],
    { revalidate: 86400 } // 86400 seconds = 1 day
);

export const GetQueriesByPage = async (siteUrl: string, pageUrl: string) => {

    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612yWfIYNaZELBGaawA6jwcMViLw-WybNCla7LICVo1lvblXyxl7dr0o_xcbIOhPbKaxuFSmRQ6a5s_RtB1LQEhABiB8YWW74jYoSP2cZu1UvxwX9n6g5TOYfK4eo_1kysVkkg9s8DcdhSe6awoLesPOMh39ItDFwBxwmaCgYKAY0SARISFQHGX2MiCw1NsxEnGFx07H-mL82gFQ0175',
        refresh_token: '1//0htOaMw2GQIf9CgYIARAAGBESNwF-L9IrCsG3XmwJoGuG7HlUITL8l1jji9X22HvsdmKHyU6KykA3Jc3xvbf8SmWaefg9nAemHQc'
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
            dimensions: ['query', 'page'],
            dimensionFilterGroups: [
                {
                    filters: [
                        {
                            dimension: 'page',
                            operator: 'equals',
                            expression: pageUrl, // The page URL you want to filter on
                        },
                    ],
                },
            ],
            rowLimit: 5000, // Adjust as needed
        },
    });

    const queries = response.data.rows || [];

    return queries
}

export const GetSites = async (userId: number) => {
    const token = await GetUserToken(userId)

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

    return sites?.map((site, id) => {
        return {
            id: String(id),
            name: site.siteUrl || ''
        }
    }) ?? []
}

export const GetSitesCache = unstable_cache(
    async (userId: number) => {
        return await GetSites(userId);
    },
    ['sites-list'],
    { revalidate: 86400 } // 86400 seconds = 1 day
);