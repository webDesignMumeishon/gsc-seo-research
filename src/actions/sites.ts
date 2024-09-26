'use server'

import SiteService from "@/services/sites";
import { Sites } from "./google";
import { revalidateTag } from "next/cache";
import { SITES_LIST_CACHE_TAG } from "@/utils";

export const DeleteSite = async (siteId: number): Promise<number> => {
    const site = await SiteService.removeSite(siteId)
    revalidateTag(SITES_LIST_CACHE_TAG)
    return site.id
}

export const GetSites = async (userId: number): Promise<Sites[]> => {
    try {
        const sites = await SiteService.getUserSites(userId)

        if (sites.length === 0) {
            return []
        }

        return sites
    } catch (error) {
        console.log(error)
        return []
    }
}