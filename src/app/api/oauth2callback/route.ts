import { oauth2Client } from "@/lib/oauth2-client";
import prisma from "@/lib/prisma";
import { decodeTokenId } from "@/utils/jwt";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    try {
        if (code !== null) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const { userId } = JSON.parse(state ?? '');

            const subId = decodeTokenId(tokens.id_token!)

            const token = await prisma.token.upsert({
                where: {
                    subId_userId: { userId, subId: subId },
                },
                update: {},
                create: {
                    access_token: tokens.access_token!,
                    refresh_token: tokens.refresh_token!,
                    userId,
                    expiry_date: new Date(tokens.expiry_date!),
                    subId,
                }
            });


            return Response.redirect(`http://localhost:3000/connect?subId=${token.subId}&userId=${userId}`);
        }
        else {
            throw new Error('Error retrieving access token')
        }
    } catch (error: any) {
        console.error('Error retrieving access token', error);
        // Response.json({ msg: error?.message });
    }
}