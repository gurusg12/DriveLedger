import db from "../db.js";

export const all_uploads = function (req, res) {
    try {
        const { user_id } = req.params;

        const files = db.prepare(`
            SELECT *
            FROM files_data
            WHERE user_id = ?
        `).all(user_id);

        res.json({
            success: true,
            data: files,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};