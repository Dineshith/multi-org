import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.query(
            `
            SELECT
                u.id,
                u.organization_id,
                u.name,
                u.email,
                u.password_hash,
                u.profile_photo_url,
                u.role,
                u.token_version,

                o.name AS organization_name,
                o.slug AS organization_slug,
                o.status AS organization_status

            FROM users u

            LEFT JOIN organizations o
                ON u.organization_id = o.id

            WHERE u.email = ?

            LIMIT 1
            `,
            [email]
        );

        // User not found
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Org Admin can login only if organization is active
        if (
            user.role === "ORG_ADMIN" &&
            user.organization_status !== "ACTIVE"
        ) {
            return res.status(403).json({
                success: false,
                message: "Your organization is inactive"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                organization_id: user.organization_id,
                email: user.email,
                role: user.role,
                token_version: user.token_version
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile_photo_url: user.profile_photo_url,
                role: user.role,
                organization_id: user.organization_id,
                organization_name: user.organization_name,
                organization_slug: user.organization_slug
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// GET LOGGED-IN USER PROFILE
const getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.profile_photo_url,
                u.role,
                u.organization_id,

                o.name AS organization_name,
                o.slug AS organization_slug

            FROM users u

            LEFT JOIN organizations o
                ON u.organization_id = o.id

            WHERE u.id = ?

            LIMIT 1
            `,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};
// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find user
        const [users] = await db.query(
            `
            SELECT id
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        // Don't reveal whether email exists
        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }

        const user = users[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Token expires in 15 minutes
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        // Save token
        await db.query(
            `
            INSERT INTO password_reset_tokens
            (user_id, token, expires_at)
            VALUES (?, ?, ?)
            `,
            [user.id, resetToken, expiresAt]
        );

        // Temporary:
        console.log("PASSWORD RESET TOKEN:", resetToken);

        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Find valid reset token
        const [tokens] = await db.query(
            `
            SELECT
                id,
                user_id
            FROM password_reset_tokens
            WHERE token = ?
              AND used = FALSE
              AND expires_at > NOW()
            LIMIT 1
            `,
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        const resetToken = tokens[0];

        // Hash new password
        const passwordHash = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        await db.query(
            `
            UPDATE users
            SET
                password_hash = ?,
                token_version = token_version + 1
            WHERE id = ?
            `,
            [passwordHash, resetToken.user_id]
        );

        // Mark reset token as used
        await db.query(
            `
            UPDATE password_reset_tokens
            SET used = TRUE
            WHERE id = ?
            `,
            [resetToken.id]
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// LOGOUT
const logout = async (req, res) => {
    try {
        // Increase token version
        // This will invalidate the current JWT
        await db.query(
            `
            UPDATE users
            SET token_version = token_version + 1
            WHERE id = ?
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// EXPORT
export {
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    logout
};