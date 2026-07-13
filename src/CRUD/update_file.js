import db from "../db.js";

export const update_file = (req, res) => {
    const { id, title, remarks } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE files_data
            SET title = ?, remarks = ?
            WHERE id = ?
        `);

        const result = stmt.run(title, remarks, id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "File updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};