import { google } from "googleapis";
import oauth2Client from "../googleAuth.js";
import db from "./db.js";
import { get_token } from "../config/get_token.js";

export const signup = function (req, res) {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ]
    });
     res.json({
        url: url
    });
}

export const callback = async (req, res) => {

    const code = req.query.code;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            version: "v2",
            auth: oauth2Client
        });
        const { data } = await oauth2.userinfo.get();
        
        
        db.prepare(`
        INSERT INTO users (
            id,
            email,
            name,
            picture,
            tokens
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(
        data.id,
        data.email,
        data.name,
        data.picture,
        JSON.stringify(tokens)
    );
        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}