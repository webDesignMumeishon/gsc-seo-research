import { oauth2Client } from '@/lib/oauth2-client';
import { google, webmasters_v3 } from 'googleapis'


export async function GET(req: Request) {
    oauth2Client.setCredentials({
        access_token: 'ya29.a0AcM612yWfIYNaZELBGaawA6jwcMViLw-WybNCla7LICVo1lvblXyxl7dr0o_xcbIOhPbKaxuFSmRQ6a5s_RtB1LQEhABiB8YWW74jYoSP2cZu1UvxwX9n6g5TOYfK4eo_1kysVkkg9s8DcdhSe6awoLesPOMh39ItDFwBxwmaCgYKAY0SARISFQHGX2MiCw1NsxEnGFx07H-mL82gFQ0175',
        refresh_token: '1//0htOaMw2GQIf9CgYIARAAGBESNwF-L9IrCsG3XmwJoGuG7HlUITL8l1jji9X22HvsdmKHyU6KykA3Jc3xvbf8SmWaefg9nAemHQc'
    })

    const webmasters = google.webmasters({
        version: 'v3',
        auth: oauth2Client,
    });

    const res = await webmasters.sites.list();

    const analytics = await webmasters.searchanalytics.query({
        siteUrl: 'sc-domain:spokaneroofing.co',
        requestBody: {
            startDate: '2024-06-01',
            endDate: '2024-09-13',
            dimensions: ['date', 'query'],
            dimensionFilterGroups: [
                {
                    filters: [{
                        dimension: 'query',
                        operator: 'contains', // Use 'contains' to filter by a substring
                        expression: 'roof'   // The substring to match
                    }]
                }
            ]
        }
    });

    // const regex = /^[\w\W\s\S]{25,}/i;
    // const results = analytics.data.rows?.filter((keyword: webmasters_v3.Schema$ApiDataRow) => {

    //     const key = keyword?.keys?.[0] ?? ''
    //     const position = keyword.position!

    //     if (regex.test(key) && position > 10 && position < 20) {
    //         return keyword
    //     }
    // })

    const rows = analytics.data.rows || [];

    // Sort rows by date (keys[0] contains the date)
    rows.sort((a, b) => new Date(a?.keys?.[0] ?? 0).getTime() - new Date(b?.keys?.[0] ?? 0).getTime());

    return Response.json({ data: analytics.data })
}

