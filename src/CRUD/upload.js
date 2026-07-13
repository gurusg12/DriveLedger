import fs from "fs";
import getDriveClient from "../../driveClient.js";
import { file_metadata } from "../metadata.js";

export const uploadfiles = async function (req, res) {

    const { id , title ,remarks } = req.body
    const { drive, user_folder_id } = getDriveClient(id);

    try {
        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname,
                parents: [user_folder_id], // Upload to this folder
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            },
            fields: "id,name,webContentLink",
        });

        const fileId = response.data.id;

        // Make the file public
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const file = await drive.files.get({
            fileId,
            fields: "webViewLink,webContentLink,thumbnailLink",
        });


        fs.unlinkSync(req.file.path);

        file_metadata({
            id: fileId,
            file_name: response.data.name,
            thumbnailLink: file.data.webContentLink,
            user_id: id,
            title: title , 
            remarks : remarks
        });
        
        res.json({
            success: true,
            file: {
                id: fileId,
                name: response.data.name,
                thumbnailLink: file.data.webContentLink,
                webViewLink: file.data.webViewLink,
                webContentLink: file.data.webContentLink,
            },
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}