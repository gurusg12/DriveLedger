import fs from "fs";
import getDriveClient from "../../driveClient.js";
import { file_metadata } from "../metadata.js";

export const uploadfiles = async function (req, res)  {
    
    const {id} = req.body
    const {drive , user_folder_id} = getDriveClient(id);

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
            fields: "id,name,thumbnailLink",
        });

        fs.unlinkSync(req.file.path);        
        
        file_metadata({id:response.data.id , file_name: response.data.name  , thumbnailLink :response.data.thumbnailLink , user_id:id })

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

}