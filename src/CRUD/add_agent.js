import db from "../db.js";

export const add_agent = (req, res) => {

    const { auth_id, email, password } = req.body;

    try {

        const stmt = db.prepare(`
            INSERT INTO agents (auth_id, email, password)
            VALUES (?, ?, ?)
        `);

        stmt.run(auth_id, email, password);

        res.status(201).json({
            success: true,
            message: "Agent added successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};