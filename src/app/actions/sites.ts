'use server'

import SiteService from "@/services/sites";
import { SITES_LIST_CACHE_TAG } from "@/utils";
import { revalidateTag } from "next/cache";

// ********************************* Function *********************************
export const DeleteSite = async (siteId: number): Promise<number> => {
    const site = await SiteService.removeSite(siteId)
    revalidateTag(SITES_LIST_CACHE_TAG)
    return site.id
}

export const GetSites = (userId: string) => {
    return SiteService.getUserSites(userId);
}


