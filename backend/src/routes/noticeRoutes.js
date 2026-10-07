import express from "express";

import {
  createNotice,
  deleteNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
} from "../controllers/noticeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all notices - public
router.get("/", getAllNotices);

// Get notice by ID - public
router.get("/:id", getNoticeById);

// Create notice
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  createNotice
);

// Update notice
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  updateNotice
);

// Delete notice
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  deleteNotice
);

export default router;