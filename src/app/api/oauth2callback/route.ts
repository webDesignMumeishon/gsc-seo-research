import { oauth2Client } from "@/lib/oauth2-client";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
    console.log(req)

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    try {
        if (code !== null) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const { userId } = JSON.parse(state ?? '');

            const credentials = await prisma.token.create({
                data: {
                    access_token: tokens?.access_token ?? '',
                    refresh_token: tokens?.refresh_token ?? '',
                    userId: Number(userId)
                },
            })

            return Response.redirect('http://localhost:3000/dashboard');
        }
        else {
            throw new Error('Error retrieving access token')
        }
    } catch (error: any) {
        console.error('Error retrieving access token', error);
        // Response.json({ msg: error?.message });
    }
}

oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        // Store the refresh token in your database
        console.log('Refresh Token:', tokens.refresh_token);
    }
    console.log('Access Token:', tokens.access_token);
});