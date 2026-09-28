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

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getAllNews);

router.get("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getNewsById);

router.post("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createNews);

router.put("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateNews);

router.delete("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteNews);

export default router;
