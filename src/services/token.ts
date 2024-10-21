import { oauth2Client } from "@/lib/oauth2-client";
import prisma from "@/lib/prisma";
import { GET_SITE_TOKEN } from "@/utils";
import { Token } from "@prisma/client";
import { revalidateTag } from "next/cache";

class TokenService {
    public static async refreshToken(token: Token) {
        if (new Date(token.expiry_date).toISOString() < new Date().toISOString()) {

            oauth2Client.setCredentials({ access_token: token.access_token, refresh_token: token.refresh_token })

            const newTokens = await oauth2Client.refreshAccessToken();

            const tokenUpdated = await prisma.token.update({
                where: { id: token.id! },
                data: {
                    access_token: newTokens.credentials.access_token!,
                    expiry_date: new Date(newTokens.credentials.expiry_date!),
                },
            });

            revalidateTag(GET_SITE_TOKEN)

            return tokenUpdated
        }
        else {
            return token
        }
    }

    public static async getUserToken(userId: string, siteUrl: string) {
        const site = await prisma.site.findFirst({
            where: {
                userId,
                url: siteUrl
            },
            include: {
                token: true
            },
        });

        if (site?.token !== undefined) {
            TokenService.refreshToken(site.token)
            return site.token
        }
        else {
            throw new Error('Missing token')
        }
    }
}

export default TokenService