import { GetUserToken } from "@/app/actions/token";
import { Dimension, DimensionFilterGroups, GoogleDataRow, GoogleSearchConsoleRequest, GoogleSearchConsoleResponse } from "@/types/googleapi";
import DateService, { YYYYMMDD } from "@/utils/dateService";
import axios from "axios";
import moment from "moment";

class Request implements GoogleSearchConsoleRequest {
    public startDate: string
    public endDate: string
    public rowLimit: number = 5000
    public dimensionFilterGroups?: DimensionFilterGroups[]
    public dimensions: Dimension[]
    public aggregationType: string | null

    constructor(startDate: Date, endDate: Date, dimensions: Dimension[] = [], aggregationType = null, dimensionFilterGroups?: []) {
        this.startDate = DateService.formatDateYYYYMMDD(startDate)
        this.endDate = DateService.formatDateYYYYMMDD(endDate)
        this.dimensions = dimensions
        this.aggregationType = aggregationType
        this.dimensionFilterGroups = dimensionFilterGroups
    }
}

function getDatesInRange(startDate: Date, endDate: Date): Record<string, any> {
    const dateArray: YYYYMMDD[] = [];
    const dateObject: Record<string, any> = {};
    let currentDate = new Date(startDate); // Create a new Date object to avoid modifying the original

    while (currentDate <= moment(endDate).subtract(1, 'day').toDate()) {
        const formattedDate = DateService.formatDateYYYYMMDD(currentDate); // Format date as 'YYYY-MM-DD'
        dateObject[formattedDate] = null; // You can assign any value you want here
        currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
    }

    return dateObject;
}

class SearchConsoleApi {
    private static async apiClient(userId: string, requestBody: GoogleSearchConsoleRequest, domain: string) {
        const apiUrl = `https://searchconsole.googleapis.com/webmasters/v3/sites/${domain}/searchAnalytics/query`;

        const accessToken = (await GetUserToken(userId, domain)).access_token

        return axios.post<GoogleSearchConsoleResponse>(apiUrl, requestBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

    }

    public static async pagesMetrics(userId: string, startDate: Date, endDate: Date, domain: string) {
        const response = await this.apiClient(userId, new Request(startDate, endDate, ['page']), domain)
        const result = response.data.rows?.map((page: any) => {
            return {
                page: page.keys?.[0] || 'unavailable',
                position: Math.round(page.position!),
                clicks: page.clicks!,
                ctr: Math.round(page.ctr! * 100),
                impressions: page.impressions!
            }
        })
        if (result !== undefined) {
            return result!
        }
        else {
            return []
        }
    }

    public static async dateMetrics(userId: string, startDate: Date, endDate: Date, domain: string) {
        const request = new Request(startDate, endDate, ['date'])
        const response = await this.apiClient(userId, request, domain)
        const objectRange = getDatesInRange(startDate, endDate)
        let lastDate: string = response.data.rows?.[response.data.rows.length - 1].keys?.[0]!

        const result = Object.keys(objectRange).reduce<{ [key: string]: any }>((acc: any, curr: string) => {
            const row = response.data.rows?.find(row => row.keys?.[0] === curr)

            if (row !== undefined) {
                const clicks = row.clicks || 0
                const ctr = (row.ctr! * 100) || 0
                const impressions = row.impressions || 0
                const position = row.position || 0

                acc[row.keys?.[0] as string] = {
                    date: curr,
                    clicks,
                    ctr,
                    impressions,
                    position,
                }

                lastDate = curr
            }
            else {
                if (new Date(curr) < new Date(lastDate)) {
                    acc[curr] = {
                        date: curr,
                        clicks: 0,
                        ctr: 0,
                        impressions: 0,
                        position: 0,
                    }
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
    }

    public static async queriesMetrics(userId: string, startDate: Date, endDate: Date, domain: string) {
        const request = new Request(startDate, endDate, ['query'])
        const response = await this.apiClient(userId, request, domain)

        const result = response.data.rows?.map(query => {
            return {
                query: query.keys?.[0] || 'unavailable',
                position: Math.round(query.position!),
                clicks: query.clicks!,
                ctr: Math.round(query.ctr! * 100),
                impressions: query.impressions!
            }
        })
        if (result !== undefined) {
            return result!
        }
        else {
            return []
        }
    }
}

export default SearchConsoleApi