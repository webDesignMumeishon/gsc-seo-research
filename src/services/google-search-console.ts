import { oauth2Client } from '@/lib/oauth2-client';
import { DateMetrics, GoogleDataRow } from '@/types/googleapi';
import DateService from '@/utils/dateService';
import { OAuth2Client } from 'google-auth-library';
import { google, webmasters_v3 } from 'googleapis'


class GoogleSearchConsoleService {
    private oauth2Client: OAuth2Client = oauth2Client
    private webmasters: webmasters_v3.Webmasters;

    constructor(accessToken: string, refreshToken: string) {
        this.setCredentials(accessToken, refreshToken);
        this.webmasters = google.webmasters({
            version: 'v3',
            auth: this.oauth2Client,
        });
    }

    private setCredentials(accessToken: string, refreshToken: string) {
        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        return this.oauth2Client
    }

    public async getQueriesByPage(url: string, pageUrl: string, startDate: Date, endDate: Date) {
        const response = await this.webmasters.searchanalytics.query({
            siteUrl: url,
            requestBody: {
                startDate: DateService.formatDateYYYYMMDD(startDate),
                endDate: DateService.formatDateYYYYMMDD(endDate),
                dimensions: ['query', 'page'],
                dimensionFilterGroups: [
                    {
                        filters: [
                            {
                                dimension: 'page',
                                operator: 'equals',
                                expression: pageUrl,
                            },
                        ],
                    },
                ],
                rowLimit: 5000,
            },
        } as any);

        const queries = response.data.rows || [];
        return queries
    }

    public async getPagesMetrics(url: string, startDate: Date, endDate: Date) {
        const response = await this.webmasters.searchanalytics.query({
            siteUrl: url,
            requestBody: {
                startDate: DateService.formatDateYYYYMMDD(startDate),
                endDate: DateService.formatDateYYYYMMDD(endDate),
                rowLimit: 5000,
                dimensionFilterGroups: [],
                dimensions: ['page'],
                aggregationType: 'auto'
            },
        });

        const result = response.data.rows?.map(page => {
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

    public async getQueriesMetrics(url: string, startDate: Date, endDate: Date) {
        const response = await this.webmasters.searchanalytics.query({
            siteUrl: url,
            requestBody: {
                startDate: DateService.formatDateYYYYMMDD(startDate),
                endDate: DateService.formatDateYYYYMMDD(endDate),
                rowLimit: 5000,
                dimensionFilterGroups: [],
                dimensions: ['query'],
                aggregationType: 'auto'
            },
        });

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

    public async getDatesMetrics(siteUrl: string, startDate: Date, endDate: Date): Promise<DateMetrics[]> {
        const response = await this.webmasters.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: DateService.formatDateYYYYMMDD(startDate),
                endDate: DateService.formatDateYYYYMMDD(endDate),
                dimensions: ['date'],
                rowLimit: 5000,
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
}

export default GoogleSearchConsoleService