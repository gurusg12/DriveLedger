import db from "./db.js";

export const updateUser  = (req, res) => {
    const { password, folder_id , email} = req.body;

    try {
        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email);

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
                WHERE email = ?
            `).run(password, folder_id, email);
        } else {
            db.prepare(`
                UPDATE users
                SET folder_id = ?
                WHERE email = ?
            `).run(folder_id, email);
        }

        res.json({
            success: true,
            message: "User updated successfully",   
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};