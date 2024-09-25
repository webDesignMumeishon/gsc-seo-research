import prisma from "@/lib/prisma";
import { GoogleAPISitesList } from "@/types/googleapi";

class SiteService {
    public static async getUserSites(userId: number) {
        return prisma.site.findMany({
            where: {
                userId: userId
            }
        })
    }
}

export default SiteService