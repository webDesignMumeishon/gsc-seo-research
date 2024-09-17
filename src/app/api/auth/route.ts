import { oauth2Client } from "@/lib/oauth2-client";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Allows us to get a refresh token
        prompt: 'consent',
        scope: SCOPES,
        state: JSON.stringify({ userId }),
    });

    return Response.json(authUrl)
}