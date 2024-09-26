import prisma from "@/lib/prisma";

class SiteService {
    public static async getUserSites(userId: number) {
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
}

export default SiteService