import db from "../db.js";

export const login_user = (req, res) => {
    const { email, password } = req.body;

    try {

        // Check users table first
        const user = db.prepare(`
            SELECT *
            FROM users
            WHERE email = ? AND password = ?
        `).get(email, password);

        if (user && user.tokens) {
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    folder_id: user.folder_id,
                    name: user.name,
                    picture: user.picture,
                    tokens: user.tokens,
                    role: user.role
                }
            });
        }

        // Check agents table
        const agent = db.prepare(`
            SELECT *
            FROM agents
            WHERE email = ? AND password = ?
        `).get(email, password);

        if (agent) {
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: agent.auth_id,
                    email: agent.email,
                    role: agent.role
                }
            });
        }

        // Neither found
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
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