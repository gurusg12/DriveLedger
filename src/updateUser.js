import db from "./db.js";

export const updateUser  = (req, res) => {
    const { id } = req.params;
    const { password, folder_id } = req.body;

    try {
        const user = db.prepare(
            "SELECT * FROM users WHERE id = ?"
        ).get(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // User doesn't have a password yet
        if (!user.password) {
            db.prepare(`
                UPDATE users
                SET password = ?, folder_id = ?
                WHERE id = ?
            `).run(password, folder_id, id);
        } else {
            // User already has a password, only update folderId
            db.prepare(`
                UPDATE users
                SET folder_id = ?
                WHERE id = ?
            `).run(folder_id, id);
        }

        res.json({
            success: true,
            message: "User updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};