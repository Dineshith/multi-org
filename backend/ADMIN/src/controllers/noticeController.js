import db from "../config/db.js";
import fs from "fs";
import path from "path";

// =====================================
// GET ALL NOTICES
// =====================================

const getAllNotices = async (req, res) => {
    try {
        const [notices] = await db.query(
            "SELECT * FROM notice ORDER BY createdAt DESC"
        );

        return res.status(200).json({
            success: true,
            notices
        });

    } catch (error) {
        console.error("Get notices error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notices",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE NOTICE
// =====================================

const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [notices] = await db.query(
            "SELECT * FROM notice WHERE id = ?",
            [id]
        );

        if (notices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        return res.status(200).json({
            success: true,
            notice: notices[0]
        });

    } catch (error) {
        console.error("Get notice error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notice",
            error: error.message
        });
    }
};


// =====================================
// CREATE NOTICE
// =====================================

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
        } = req.body || {};


        // Required fields
        if (!title || !category || !expiry_date || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }


        // Optional attachment
        const attachment = req.file
            ? `/uploads/notices/${req.file.filename}`
            : null;


        // Default status
        const noticeStatus = status || "draft";


        // Published date
        const publishedAt =
            noticeStatus === "published"
                ? new Date()
                : null;


        const [result] = await db.query(
            `INSERT INTO notice
            (
                title,
                category,
                target_audience,
                expiry_date,
                message,
                attachment,
                is_pinned,
                status,
                publishedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                category,
                target_audience || null,
                expiry_date,
                message,
                attachment,
                is_pinned === true || is_pinned === "true",
                noticeStatus,
                publishedAt
            ]
        );


        return res.status(201).json({
            success: true,
            message: "Notice created successfully",
            noticeId: result.insertId
        });

    } catch (error) {

        console.error("Create notice error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create notice",
            error: error.message
        });
    }
};


// =====================================
// UPDATE NOTICE
// =====================================

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
        } = req.body || {};


        // Check notice exists
        const [existing] = await db.query(
            "SELECT * FROM notice WHERE id = ?",
            [id]
        );


        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }


        const oldNotice = existing[0];


        // Keep old attachment
        let attachment = oldNotice.attachment;


        // If new attachment uploaded
        if (req.file) {

            // Delete old attachment
            if (oldNotice.attachment) {

                const oldFilePath = path.join(
                    process.cwd(),
                    "public",
                    oldNotice.attachment.replace(/^[/\\]+/, "")
                );


                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }


            attachment =
                `/uploads/notices/${req.file.filename}`;
        }


        // Keep old values if not provided
        const updatedTitle =
            title || oldNotice.title;


        const updatedCategory =
            category || oldNotice.category;


        const updatedTargetAudience =
            target_audience !== undefined
                ? target_audience
                : oldNotice.target_audience;


        const updatedExpiryDate =
            expiry_date || oldNotice.expiry_date;


        const updatedMessage =
            message || oldNotice.message;


        const updatedPinned =
            is_pinned !== undefined
                ? (
                    is_pinned === true ||
                    is_pinned === "true"
                )
                : oldNotice.is_pinned;


        const noticeStatus =
            status || oldNotice.status;


        // Published date
        let publishedAt = oldNotice.publishedAt;


        if (
            noticeStatus === "published" &&
            !oldNotice.publishedAt
        ) {
            publishedAt = new Date();
        }


        if (noticeStatus !== "published") {
            publishedAt = null;
        }


        await db.query(
            `UPDATE notice
             SET
                title = ?,
                category = ?,
                target_audience = ?,
                expiry_date = ?,
                message = ?,
                attachment = ?,
                is_pinned = ?,
                status = ?,
                publishedAt = ?
             WHERE id = ?`,
            [
                updatedTitle,
                updatedCategory,
                updatedTargetAudience,
                updatedExpiryDate,
                updatedMessage,
                attachment,
                updatedPinned,
                noticeStatus,
                publishedAt,
                id
            ]
        );


        return res.status(200).json({
            success: true,
            message: "Notice updated successfully"
        });

    } catch (error) {

        console.error("Update notice error:", error);


        // Delete newly uploaded file if update fails
        if (req.file) {

            const uploadedFilePath = path.join(
                process.cwd(),
                "public",
                "uploads",
                "notices",
                req.file.filename
            );


            if (fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
            }
        }


        return res.status(500).json({
            success: false,
            message: "Failed to update notice",
            error: error.message
        });
    }
};


// =====================================
// DELETE NOTICE
// =====================================

const deleteNotice = async (req, res) => {
    try {

        const { id } = req.params;


        // Get attachment before deleting
        const [existing] = await db.query(
            "SELECT attachment FROM notice WHERE id = ?",
            [id]
        );


        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }


        // Delete attachment file
        if (existing[0].attachment) {

            const filePath = path.join(
                process.cwd(),
                "public",
                existing[0].attachment.replace(/^[/\\]+/, "")
            );


            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }


        // Delete notice
        await db.query(
            "DELETE FROM notice WHERE id = ?",
            [id]
        );


        return res.status(200).json({
            success: true,
            message: "Notice deleted successfully"
        });

    } catch (error) {

        console.error("Delete notice error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete notice",
            error: error.message
        });
    }
};


// =====================================
// EXPORT
// =====================================

export {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
};