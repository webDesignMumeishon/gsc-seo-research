import { oauth2Client } from "@/lib/oauth2-client";
import prisma from "@/lib/prisma";
import { Token } from "@prisma/client";

class TokenService {
    public static async refreshToken(token: Token) {
        if (token.expiry_date.toISOString() < new Date().toISOString()) {

            oauth2Client.setCredentials({ access_token: token.access_token, refresh_token: token.refresh_token })

            const newTokens = await oauth2Client.refreshAccessToken();

            await prisma.token.update({
                where: { id: token.id! },
                data: {
                    access_token: newTokens.credentials.access_token!,
                    expiry_date: new Date(newTokens.credentials.expiry_date!),
                },
            });
        }
    }




}

export default TokenService