import express from "express";

import {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
} from "../controllers/noticeController.js";

import upload from "../middleware/multerconfig.js";

const router = express.Router();

// GET all notices
router.get("/", getAllNotices);

// GET single notice
router.get("/:id", getNoticeById);

// CREATE notice with optional attachment
router.post("/", upload.single("attachment"), createNotice);

// UPDATE notice with optional new attachment
router.put("/:id", upload.single("attachment"), updateNotice);

// DELETE notice
router.delete("/:id", deleteNotice);

export default router;