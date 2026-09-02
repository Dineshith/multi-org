import db from "../config/db.js";

// =========================
// GET ALL NOTICES
// =========================
const getAllNotices = async (req, res) => {
    try {
        const [notices] = await db.query(
            "SELECT * FROM notices ORDER BY created_at DESC"
        );

        res.status(200).json({
            success: true,
            notices
        });

    } catch (error) {
        console.error("Get notices error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notices"
        });
    }
};


// =========================
// GET SINGLE NOTICE
// =========================
const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [notices] = await db.query(
            "SELECT * FROM notices WHERE id = ?",
            [id]
        );

        if (notices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            notice: notices[0]
        });

    } catch (error) {
        console.error("Get notice error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notice"
        });
    }
};



// CREATE NOTICE
// =========================
const createNotice = async (req, res) => {
    try {
        const {
            title,
            category,
            target_audience,
            expiry_date,
            message,
            is_pinned,
            status
        } = req.body;

        // Basic validation
        if (
            !title ||
            !category ||
            !target_audience ||
            !expiry_date ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const [result] = await db.query(
            `INSERT INTO notices
            (
                title,
                category,
                target_audience,
                expiry_date,
                message,
                is_pinned,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                category,
                target_audience,
                expiry_date,
                message,
                is_pinned || false,
                status || "draft"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            noticeId: result.insertId
        });

    } catch (error) {
        console.error("Create notice error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create notice"
        });
    }
};



// UPDATE NOTICE
const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            category,
            target_audience,
            expiry_date,
            message,
            is_pinned,
            status
        } = req.body;

        const [result] = await db.query(
            `UPDATE notices
            SET
                title = ?,
                category = ?,
                target_audience = ?,
                expiry_date = ?,
                message = ?,
                is_pinned = ?,
                status = ?
            WHERE id = ?`,
            [
                title,
                category,
                target_audience,
                expiry_date,
                message,
                is_pinned || false,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notice updated successfully"
        });

    } catch (error) {
        console.error("Update notice error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update notice"
        });
    }
};



// DELETE NOTICE
const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM notices WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notice deleted successfully"
        });

    } catch (error) {
        console.error("Delete notice error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete notice"
        });
    }
};


export { getAllNotices, getNoticeById, createNotice, updateNotice, deleteNotice };