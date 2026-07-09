import { google } from "googleapis";
import credentials from "./oauth_client.json" with { type: "json" };



const { client_id, client_secret, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

export default oauth2Client;