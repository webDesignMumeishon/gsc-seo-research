import { oauth2Client } from "@/lib/oauth2-client";


export async function GET(req: Request) {
    // const code = req.query.code;

    // console.log(await req.json())
    const url = new URL(req.url);
    // Get the 'code' parameter from the query string
    const code = url.searchParams.get('code');

    // Do something with the 'code'
    console.log('Code:', code);


    try {
        if (code !== null) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            // Save the tokens for future use
            console.log('Access Token:', tokens.access_token);
            console.log('Refresh Token:', tokens.refresh_token);

            // Now you can use the OAuth2 client to make API requests
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