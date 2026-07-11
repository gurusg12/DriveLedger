import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/db.js";
import oauth2Client from "./googleAuth.js";
import fs from "fs";
import upload from "./multerConfig.js";
import { google } from "googleapis";
import getDriveClient from "./driveClient.js";
import { callback, signup } from "./src/login.js";
import { updateUser } from "./src/updateUser.js";
import { uploadfiles } from "./src/CRUD/upload.js";
import { login_user } from "./src/CRUD/login_user.js";
import { all_uploads } from "./src/CRUD/all_uploads.js";
import { add_agent } from "./src/CRUD/add_agent.js";
import { delete_file } from "./src/CRUD/delete_file.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

app.get("/signup", signup);

app.get("/auth/google/callback", callback);

app.post("/updateUser", updateUser);

app.post("/login", login_user);

app.post("/upload", upload.single("file"), uploadfiles);

app.get("/alluploads/:user_id", all_uploads)

app.post('/add/agent', add_agent)

app.post("/deletefile", delete_file);









// app.get("/image/:id", async (req, res) => {
//     const drive = getDriveClient(user);

//     const response = await drive.files.get(
//         {
//             fileId: req.params.id,
//             alt: "media",
//         },
//         {
//             responseType: "stream",
//         }
//     );

//     res.setHeader(
//         "Content-Type",
//         response.headers["content-type"]
//     );

//     response.data.pipe(res);
// });


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