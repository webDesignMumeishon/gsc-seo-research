import ISO8601 from "@/utils/ISO8601";
import { webmasters_v3 } from "googleapis";

export type GoogleAPISitesList = webmasters_v3.Schema$WmxSite[]
export type GoogleApiDataRaw = webmasters_v3.Schema$ApiDataRow

export type GoogleDataRow = {
    ctr: number;
    impressions: number;
    keys?: string[];
    position: number;
    clicks: number;
}

// type ISO8601 = string

export type SiteMetrics = GoogleDataRow & {
    date: ISO8601
}



