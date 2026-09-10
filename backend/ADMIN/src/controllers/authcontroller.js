import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===============================
// SETUP ADMIN
// ===============================
const setupAdmin = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required"
            });
        }

        // Check if email already exists
        const [existingUser] = await db.query(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        // Database column: name
        // Database role value: ADMIN
        await db.query(
            `INSERT INTO user
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
                fullName,
                email,
                hashedPassword,
                "ADMIN"
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Admin setup successful"
        });

    } catch (error) {
        console.error("Setup admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to setup admin"
        });
    }
};


// ===============================
// ADMIN LOGIN
// ===============================
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
            `SELECT id, name, email, password, role
             FROM user
             WHERE email = ?`,
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

        // ===============================
        // CHECK ADMIN ROLE
        // ===============================
        // DB contains ADMIN in uppercase,
        // so convert role to lowercase before checking.
        if (String(user.role).toLowerCase() !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        // ===============================
        // CHECK PASSWORD
        // ===============================
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ===============================
        // CHECK JWT SECRET
        // ===============================
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured"
            });
        }

        // ===============================
        // GENERATE JWT
        // ===============================
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // ===============================
        // LOGIN SUCCESS
        // ===============================
        return res.status(200).json({
            success: true,
            message: "Admin login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
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


// ===============================
// GET LOGGED-IN ADMIN PROFILE
// ===============================
const getProfile = async (req, res) => {
    try {
        // Check authentication
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const [users] = await db.query(
            `SELECT id, name, email, role
             FROM user
             WHERE id = ?`,
            [req.user.id]
        );

        // User not found
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const user = users[0];

        // ===============================
        // CHECK ADMIN ROLE
        // ===============================
        if (String(user.role).toLowerCase() !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        // ===============================
        // SUCCESS
        // ===============================
        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};


// ===============================
// EXPORT
// ===============================
export {
    setupAdmin,
    login,
    getProfile
};