import express from "express";
import {
  createPage,
  deletePage,
  getAllPages,
  getPageById,
  updatePage,
} from "../controllers/pageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllPages);
router.get("/:id", getPageById);

router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createPage);
router.put("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updatePage);
router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deletePage);

export default router;
