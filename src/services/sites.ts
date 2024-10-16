import prisma from "@/lib/prisma";
import { Site } from "@/types/site";

class SiteService {
    public static async getUserSites(userId: string) {
        return prisma.site.findMany({
            where: {
                userId: userId
            }
        })
    }

    public static async removeSite(id: number) {
        return prisma.site.delete({
            where: { id }
        });
    }

    public static async saveSites(userId: string, tokenId: number, sites: Site[]) {
        const sitesCreated = await Promise.all(sites.map(async site => {
            return prisma.site.create({
                data: {
                    url: site.url,
                    permission: site.permission,
                    userId: userId,
                    tokenId: tokenId
                },
                select: {
                    id: true,
                    url: true,
                    permission: true,
                },
            })
        }))

        return sitesCreated
    }
}

export default SiteService