import express from "express";
import { getAllNotices, getNoticeById, createNotice, updateNotice, deleteNotice } from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", getAllNotices);
router.get("/:id", getNoticeById);

router.post("/", createNotice);

router.put("/:id", updateNotice);

router.delete("/:id", deleteNotice);

export default router;