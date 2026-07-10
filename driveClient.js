import { google } from "googleapis";
import credentials from "./oauth_client.json" with { type: "json" };
import db from "./src/db.js";

const { client_id, client_secret, redirect_uris } = credentials.web;

export default function getDriveClient(id) {

    const user = db.prepare(
        "SELECT * FROM users WHERE id = ?"
    ).get(id);

    const token = JSON.parse(user.tokens);

    const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    oauth2Client.setCredentials(token);

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
    });

    return {
        drive,
        user_folder_id: user.folder_id
    };
}