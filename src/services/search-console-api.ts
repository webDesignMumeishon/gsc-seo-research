import { cachedGetUserToken } from "@/app/actions/cached";
import { Dimension, DimensionFilterGroups, GoogleDataRow, GoogleSearchConsoleRequest, GoogleSearchConsoleResponse } from "@/types/googleapi";
import DateService from "@/utils/dateService";
import axios from "axios";

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

class SearchConsoleApi {
    private static async apiClient(userId: string, requestBody: GoogleSearchConsoleRequest, domain: string) {
        const apiUrl = `https://searchconsole.googleapis.com/webmasters/v3/sites/${domain}/searchAnalytics/query`;

        const accessToken = (await cachedGetUserToken(userId, domain)).access_token

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

        const result = response.data.rows?.reduce<{ [key: string]: GoogleDataRow }>((acc: any, curr: any) => {
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