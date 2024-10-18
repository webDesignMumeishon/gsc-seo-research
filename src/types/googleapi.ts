import { webmasters_v3 } from "googleapis";

export type GoogleAPISitesList = webmasters_v3.Schema$WmxSite[]
export type GoogleApiDataRaw = webmasters_v3.Schema$ApiDataRow

export type GoogleMetrics = Required<Pick<GoogleApiDataRaw, 'clicks' | 'ctr' | 'position' | 'impressions'>>;

export type PageMetrics = GoogleMetrics & {
    page: string
}

export type GoogleDataRow = GoogleMetrics & {
    keys?: string[];
}

export type DateMetrics = GoogleDataRow & {
    date: string
}

export type DateKeyDataRow = {
    [key: string]: GoogleDataRow
}



