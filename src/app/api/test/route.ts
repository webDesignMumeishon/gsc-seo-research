import oauth2Client from "@/lib/oauth2-client";
import { google } from 'googleapis'


export async function GET() {
    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612zBtOATa5yaEe1-sxIRmENqAAbHS6cHyI6l4RWYxPG9FWs7-U19-ktTJj8VOF_EywtB2sAxxQRDfTG5_J6176roi9KO60hdAR2q_-5wgKMSlVF2ATHafXUSd_G7iigBvj6u0J8U4QW1dqA-TVUSiO6BT_XNZK2CjceeaCgYKAWsSARISFQHGX2MizdDro0whu2SMEkLuc1DYXQ0175',
        refresh_token: '1//0hLJ4tDKkGOWrCgYIARAAGBESNwF-L9Ir9yUB9CNOHB_8H4wvwzKRjL3K6jMr5kWjTPxZCp3UhpOm_bUSgzBQqlvlOYxgnhw_jDc'
    })

    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    const startDate = new Date();
    startDate.setDate(new Date().getDate() - 30);

    try {
        const response = await webmasters.searchanalytics.query({
            siteUrl: 'sc-domain:spokaneroofing.co',
            requestBody: {
                startDate: '2024-01-03',
                endDate: '2024-09-09',
                dimensions: ['query', 'page', 'date'],
                // dimensionFilterGroups: [
                //     {
                //         filters: [
                //             {
                //                 dimension: 'page',
                //                 operator: 'equals',
                //             },
                //         ],
                //     },
                // ],
                rowLimit: 5000,
            },
        } as any);

        const queries = response.data.rows || [];

        const aggregatedData: { [page: string]: { clicks: number, impressions: number, ctr: number, position: number, totalRows: number } } = {};

        // Group by page and aggregate the metrics
        queries.forEach((row: any) => {
            const page = row.keys[1]; // Get the page URL
            if (!aggregatedData[page]) {
                // Initialize metrics for this page if not already present
                aggregatedData[page] = {
                    clicks: 0,
                    impressions: 0,
                    ctr: 0,
                    position: 0,
                    totalRows: 0
                };
            }

            // Aggregate the metrics
            aggregatedData[page].clicks += row.clicks;
            aggregatedData[page].impressions += row.impressions;
            aggregatedData[page].ctr += row.ctr; // Summing CTR, we'll average it later
            aggregatedData[page].position += row.position; // Summing positions, we'll average it later
            aggregatedData[page].totalRows += 1; // Count the number of rows for averaging
        });

        // Finalize the average CTR and position for each page
        Object.keys(aggregatedData).forEach(page => {
            const pageData = aggregatedData[page];
            pageData.ctr = pageData.ctr / pageData.totalRows; // Average CTR
            pageData.position = pageData.position / pageData.totalRows; // Average position
        });




        return Response.json(aggregatedData)
    } catch (error: any) {
        console.error(error)
    }


}