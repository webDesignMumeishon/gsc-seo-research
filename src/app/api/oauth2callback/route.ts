import { oauth2Client } from "@/lib/oauth2-client";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    try {
        if (code !== null) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const { userId } = JSON.parse(state ?? '');
       

            return Response.redirect(`http://localhost:3000/connect?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&userId=${userId}`);
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