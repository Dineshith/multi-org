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

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getAllNotices);

router.get("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getNoticeById);

router.post("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createNotice);

router.put("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateNotice);

router.delete("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteNotice);

export default router;
