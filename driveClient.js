import { google } from "googleapis";
import credentials from "./oauth_client.json" with { type: "json" };
import fs from "fs";

const { client_id, client_secret, redirect_uris } = credentials.web;

export default function getDriveClient() {
    const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    const token = JSON.parse(fs.readFileSync("./token.json", "utf8"));

    oauth2Client.setCredentials(token);

    return google.drive({
        version: "v3",
        auth: oauth2Client,
    });
}