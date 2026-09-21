import jwt from "jsonwebtoken";
import db from "../config/db.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Check current user from database
        const [users] = await db.query(
            `
            SELECT
                id,
                organization_id,
                name,
                email,
                role,
                token_version
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const user = users[0];

        // Check if token has been invalidated
        if (user.token_version !== decoded.token_version) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Store user information in request
        req.user = {
            id: user.id,
            organization_id: user.organization_id,
            name: user.name,
            email: user.email,
            role: user.role,
            token_version: user.token_version
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;