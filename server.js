import express from "express";
import dotenv from "dotenv";
import db from "./src/db.js";
import oauth2Client from "./googleAuth.js";
import fs from "fs";
import upload from "./multerConfig.js";
import { google } from "googleapis";
import getDriveClient from "./driveClient.js";
import { callback, login } from "./src/login.js";
dotenv.config();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

app.get("/login", login);

app.get("/auth/google/callback", callback);

app.post("/upload", upload.single("file"), async (req, res) => {
    const drive = getDriveClient();

    try {

        const FOLDER_ID = "1HEjNmBNt3_w_eRx01NZ5UeLz4DTmi1-W";

        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname,
                parents: [FOLDER_ID], // Upload to this folder
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            },
            fields: "id,name,webViewLink",
        });

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            file: response.data,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message,
        });

    }

});

app.get("/files", async (req, res) => {
    const drive = getDriveClient();

    try {

        const files = await drive.files.list({

            pageSize: 100,

            fields: "files(id,name,mimeType,createdTime)",

        });

        res.json(files.data.files);

    } catch (err) {

        res.status(500).json(err);

    }

});

app.get("/files/:id", async (req, res) => {

    const drive = getDriveClient();
    try {
        const file = await drive.files.get({
            fileId: req.params.id,
            fields: "*",
        });
        res.json(file.data);

    } catch (err) {

        res.status(500).json(err);

    }

});

app.get("/download/:id", async (req, res) => {
    const drive = getDriveClient();

    try {

        const response = await drive.files.get(
            {
                fileId: req.params.id,
                alt: "media",
            },
            {
                responseType: "stream",
            }
        );

        response.data.pipe(res);

    } catch (err) {

        res.status(500).json(err);

    }

});
app.put("/rename/:id", async (req, res) => {
    const drive = getDriveClient();

    try {

        const file = await drive.files.update({

            fileId: req.params.id,

            requestBody: {
                name: req.body.name,
            },

        });

        res.json(file.data);

    } catch (err) {

        res.status(500).json(err);

    }

});

app.put("/replace/:id", upload.single("file"), async (req, res) => {




    const drive = getDriveClient();

    try {

        const response = await drive.files.update({

            fileId: req.params.id,

            media: {

                mimeType: req.file.mimetype,

                body: fs.createReadStream(req.file.path),

            },

        });

        fs.unlinkSync(req.file.path);

        res.json(response.data);

    } catch (err) {

        res.status(500).json(err);

    }

});

app.delete("/delete/:id", async (req, res) => {
    const drive = getDriveClient();

    try {

        await drive.files.delete({

            fileId: req.params.id,

        });

        res.json({

            success: true,

            message: "Deleted Successfully",

        });

    } catch (err) {

        res.status(500).json(err);

    }

});


app.post("/public/:id", async (req, res) => {
    const drive = getDriveClient();

    try {

        await drive.permissions.create({

            fileId: req.params.id,

            requestBody: {

                role: "reader",

                type: "anyone",

            },

        });

        const file = await drive.files.get({

            fileId: req.params.id,

            fields: "webViewLink,webContentLink",

        });

        res.json(file.data);

    } catch (err) {

        res.status(500).json(err);

    }

});

app.get("/search", async (req, res) => {

    const drive = getDriveClient();
    try {

        const files = await drive.files.list({

            q: `name contains '${req.query.name}'`,

            fields: "files(id,name)",

        });

        res.json(files.data.files);

    } catch (err) {

        res.status(500).json(err);

    }

});


app.post("/folder", async (req, res) => {
    const drive = getDriveClient();

    try {

        const folder = await drive.files.create({

            requestBody: {

                name: req.body.name,

                mimeType: "application/vnd.google-apps.folder",

            },

        });

        res.json(folder.data);

    } catch (err) {

        res.status(500).json(err);

    }

});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});