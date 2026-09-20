import bcrypt from "bcryptjs";
import db from "../../config/db.js";

export const createContentAdmin = async (req, res) => {
    try {
        const { organization_id, name, email, phone, password, image_url } = req.body;

        if (!organization_id || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Organization, name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const [organizations] = await db.query(
            "SELECT id FROM organizations WHERE id = ?",
            [organization_id]
        );

        if (organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active organization not found"
            });
        }

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            `INSERT INTO users
                     (organization_id, name, email, phone, password_hash, role, image_url)
                 VALUES (?, ?, ?, ?, ?, 'CONTENT_ADMIN', ?)`,
            [organization_id, name, email, phone || null, passwordHash, image_url || null]
        );

        return res.status(201).json({
            success: true,
            message: "Content admin created successfully",
            user: {
                id: result.insertId,
                organization_id: Number(organization_id),
                name,
                email,
                role: "CONTENT_ADMIN"
            }
        });
    } catch (error) {
        console.error("Create content admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create content admin"
        });
    }
};