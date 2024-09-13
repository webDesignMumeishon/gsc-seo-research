import { oauth2Client } from "@/lib/oauth2-client";

export async function GET() {
    const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Allows us to get a refresh token
        scope: SCOPES,
    });

    return Response.json(authUrl)
}