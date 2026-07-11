import getDriveClient from "../../driveClient.js";
import db from "../db.js";

export const delete_file = async function (req, res) {
    const { user_id , id } = req.body

    const { drive } = getDriveClient(user_id)

    try {
        await drive.files.delete({
            fileId: id,
        });

        db.prepare(
            "DELETE FROM files_data WHERE id = ?"
        ).run(id);

        res.json({

            success: true,

            message: "Deleted Successfully",

        });
    } catch (err) {

        res.status(500).json(err);
    }
}
