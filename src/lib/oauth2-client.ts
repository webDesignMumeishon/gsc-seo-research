import { google } from 'googleapis'
const CLIENT_ID = '768524797731-elm1o7rl7g0m0upg23qbk9dp1tok3eqk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/api/oauth2callback';

export const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);