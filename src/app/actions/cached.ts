"use server"

import { unstable_cache } from "next/cache";
import { GetSites } from "./sites";
import { SITES_LIST_CACHE_TAG } from "@/utils";

export const cachedGetSites = unstable_cache(
    async (userId: string) => { return GetSites(userId); },
    ['sites-list'],
    { tags: [SITES_LIST_CACHE_TAG], revalidate: 10 } // 86400 seconds = 1 day
);