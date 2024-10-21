import { webmasters_v3 } from "googleapis";

type GoogleSearchConsoleRequestRaw = webmasters_v3.Schema$SearchAnalyticsQueryRequest
type GoogleSearchConsoleResponseRaw = webmasters_v3.Schema$SearchAnalyticsQueryResponse
// type GoogleAPISitesList = webmasters_v3.Schema$WmxSite[]
type GoogleApiDataRaw = webmasters_v3.Schema$ApiDataRow


export type DimensionFilterGroups = webmasters_v3.Schema$ApiDimensionFilterGroup
export type Dimension = 'query' | 'page' | 'date'

export type GoogleSearchConsoleRequest = GoogleSearchConsoleRequestRaw
export type GoogleSearchConsoleResponse = GoogleSearchConsoleResponseRaw

export type GoogleMetrics = Required<Pick<GoogleApiDataRaw, 'clicks' | 'ctr' | 'position' | 'impressions'>>;

export type PageMetrics = GoogleMetrics & {
    page: string
}

export type QueryMetrics = GoogleMetrics & {
    query: string
}

export type DateMetrics = GoogleDataRow & {
    date: string
}

export type GoogleDataRow = GoogleMetrics & {
    keys?: string[];
}

export type DateKeyDataRow = {
    [key: string]: GoogleDataRow
}



