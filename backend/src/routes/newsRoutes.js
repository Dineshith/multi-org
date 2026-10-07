import express from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from "../controllers/newsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllNews);

router.get("/:id", getNewsById);

router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createNews);

router.put("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateNews);

router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteNews);

export default router;
