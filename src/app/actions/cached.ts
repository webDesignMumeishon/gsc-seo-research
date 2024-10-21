"use server"

import { unstable_cache } from "next/cache";
import { GetSites } from "./sites";
import { GET_PAGES_LIST_TAG, GET_USER_TOKEN, GLOBAL_REVALIDATE_CACHE_SECONDS, SITES_LIST_CACHE_TAG } from "@/utils";
import { PagesQueryCount } from "./google";
import { GetUserToken } from "./token";

export const cachedGetUserToken = unstable_cache(
    async (userId: string, siteUrl: string) => { return GetUserToken(userId, siteUrl); },
    ['user-token'],
    { tags: [GET_USER_TOKEN], revalidate: GLOBAL_REVALIDATE_CACHE_SECONDS }
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