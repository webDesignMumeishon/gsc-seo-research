'use server'

import { oauth2Client } from '@/lib/oauth2-client';
import { google } from 'googleapis'

const startDate = '2024-06-01';
const endDate = '2024-09-13';
const rowLimit = 5000;

export const GetPagesList = async () => {
    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612yWfIYNaZELBGaawA6jwcMViLw-WybNCla7LICVo1lvblXyxl7dr0o_xcbIOhPbKaxuFSmRQ6a5s_RtB1LQEhABiB8YWW74jYoSP2cZu1UvxwX9n6g5TOYfK4eo_1kysVkkg9s8DcdhSe6awoLesPOMh39ItDFwBxwmaCgYKAY0SARISFQHGX2MiCw1NsxEnGFx07H-mL82gFQ0175',
        refresh_token: '1//0htOaMw2GQIf9CgYIARAAGBESNwF-L9IrCsG3XmwJoGuG7HlUITL8l1jji9X22HvsdmKHyU6KykA3Jc3xvbf8SmWaefg9nAemHQc'
    })

    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    // const res = await webmasters.sites.list();

    const response = await webmasters.searchanalytics.query({
        siteUrl: 'sc-domain:spokaneroofing.co',
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

    // Transform the results into the desired format
    const result = Object.entries(pageQueryCounts).map(([page, queries]: any[], index: number) => ({
        id: index,
        page,
        numberOfQueries: queries.size  // The size of the set gives the number of unique queries
    }));

    return result
}

export const GetQueriesByPage = async (pageUrl: string) => {
    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612yWfIYNaZELBGaawA6jwcMViLw-WybNCla7LICVo1lvblXyxl7dr0o_xcbIOhPbKaxuFSmRQ6a5s_RtB1LQEhABiB8YWW74jYoSP2cZu1UvxwX9n6g5TOYfK4eo_1kysVkkg9s8DcdhSe6awoLesPOMh39ItDFwBxwmaCgYKAY0SARISFQHGX2MiCw1NsxEnGFx07H-mL82gFQ0175',
        refresh_token: '1//0htOaMw2GQIf9CgYIARAAGBESNwF-L9IrCsG3XmwJoGuG7HlUITL8l1jji9X22HvsdmKHyU6KykA3Jc3xvbf8SmWaefg9nAemHQc'
    })

    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    const response = await webmasters.searchanalytics.query({
        siteUrl: 'sc-domain:spokaneroofing.co',
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