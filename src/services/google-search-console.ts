import { oauth2Client } from '@/lib/oauth2-client';
import { OAuth2Client } from 'google-auth-library';
import { google, webmasters_v3 } from 'googleapis'
import moment from 'moment';

type YYYYMMDD = `${number}-${number}-${number}`;

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
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(endDate).format('YYYY-MM-DD'),
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

    // public async getSites(userId: number) {
    //     try {
    //         const webmasters = this.getWebmastersClient();
    //         const response = await webmasters.sites.list();
    //         const sites = response.data.siteEntry || [];

    //         // Get sites already saved in the database
    //         const dbSites = await SiteService.getUserSites(userId);
    //         const urlsInDb = new Set(dbSites.map(item => item.url));

    //         // Filter out sites that are already in the database
    //         const filteredSites = sites.filter(site => !urlsInDb.has(site.siteUrl));

    //         return filteredSites.map((site, id) => ({
    //             id: id,
    //             url: site.siteUrl || '',
    //             permission: site.permissionLevel || ''
    //         }));
    //     } catch (error) {
    //         console.error(error);
    //         return [];
    //     }
    // }
}

export default GoogleSearchConsoleService