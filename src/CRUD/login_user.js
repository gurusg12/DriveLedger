import db from "../db.js";

export const login_user = function (req, res) {
    const { email, password } = req.body;

    try {
        const user = db.prepare(`
            SELECT *
            FROM users
            WHERE email = ? AND password = ?
        `).get(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Return only the required fields
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                folder_id: user.folder_id,
                name: user.name,
                picture: user.picture,
                tokens: user.tokens
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};