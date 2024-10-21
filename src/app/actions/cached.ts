"use server"

import { unstable_cache } from "next/cache";
import { GetSites } from "./sites";
import { GET_PAGES_LIST_TAG, GET_SITE_TOKEN, GLOBAL_REVALIDATE_CACHE_SECONDS, SITES_LIST_CACHE_TAG } from "@/utils";
import { PagesQueryCount } from "./google";
import { GetSiteToken } from "./token";

export const cachedGetSiteToken = unstable_cache(
    async (userId: string, siteUrl: string) => { return GetSiteToken(userId, siteUrl); },
    ['site-token'],
    { tags: [GET_SITE_TOKEN], revalidate: GLOBAL_REVALIDATE_CACHE_SECONDS }
);

export const cachedGetSites = unstable_cache(
    async (userId: string) => { return GetSites(userId); },
    ['sites-list'],
    { tags: [SITES_LIST_CACHE_TAG], revalidate: GLOBAL_REVALIDATE_CACHE_SECONDS }
);

export const cachedGetPagesList = unstable_cache(
    async (userId: string, page: string, siteUrl: string) => {
        return await PagesQueryCount(userId, page, siteUrl);
    },
    ['pages-list'],
    { tags: [GET_PAGES_LIST_TAG], revalidate: GLOBAL_REVALIDATE_CACHE_SECONDS }
);