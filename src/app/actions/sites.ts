'use server'

import SiteService from "@/services/sites";
import { revalidateTag, unstable_cache } from "next/cache";
import { SITES_LIST_CACHE_TAG } from "@/utils";
import { Site } from "@/types/site";
import { auth } from "@clerk/nextjs/server";

// ********************************* Function *********************************
export const DeleteSite = async (siteId: number): Promise<number> => {
    const site = await SiteService.removeSite(siteId)
    revalidateTag(SITES_LIST_CACHE_TAG)
    return site.id
}

export const GetSites = (userId: string) => {
    return SiteService.getUserSites(userId);
}




// ********************************* Cached functions *********************************
export const cachedGetSites = unstable_cache(
    async (userId: string) => { return GetSites(userId); }, ['sites-list'], { tags: [SITES_LIST_CACHE_TAG], revalidate: 1 } // 86400 seconds = 1 day
);