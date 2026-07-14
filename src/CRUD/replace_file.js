import fs from "fs";
import getDriveClient from "../../driveClient.js";
import db from "../db.js";

export const replace_file = async function (req, res) {
    const { user_id, id } = req.body;

    const { drive } = getDriveClient(user_id);

    try {
        const response = await drive.files.update({
            fileId: id,
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            },
            fields: "id,name",
        });

        const fileId = response.data.id;

        // Make sure file is public
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const file = await drive.files.get({
            fileId,
            fields: "mimeType",
        });

        const mimeType = file.data.mimeType;

        let fileUrl = "";

        if (mimeType.startsWith("image/")) {
            fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        } else if (mimeType.startsWith("video/")) {
            fileUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        } else if (mimeType === "application/pdf") {
            fileUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        } else if (mimeType.startsWith("audio/")) {
            fileUrl = `https://drive.google.com/uc?id=${fileId}`;
        } else {
            fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
        }

        fs.unlinkSync(req.file.path);

        db.prepare(`
            UPDATE files_data
            SET thumbnailLink = ?
            WHERE id = ?
        `).run(fileUrl, fileId);

        res.json({
            success: true,
            file: {
                id: fileId,
                name: response.data.name,
                thumbnailLink: fileUrl,
            },
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};