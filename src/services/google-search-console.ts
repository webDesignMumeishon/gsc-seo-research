import { oauth2Client } from '@/lib/oauth2-client';
import DateService, { YYYYMMDD } from '@/utils/dateService';
import { OAuth2Client } from 'google-auth-library';
import { google, webmasters_v3 } from 'googleapis'
import moment from 'moment';


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

    public async getQueriesByPage(url: string, pageUrl: string, startDate: YYYYMMDD, endDate: YYYYMMDD) {
        const response = await this.webmasters.searchanalytics.query({
            siteUrl: url,
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
                page: page.keys?.[0]!,
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
}

export default GoogleSearchConsoleService