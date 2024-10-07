import { oauth2Client } from '@/lib/oauth2-client';
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
        });

        const queries = response.data.rows || [];
        return queries
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