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

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getAllPages);
router.get("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getPageById);
router.post("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createPage);
router.put("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updatePage);
router.delete("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deletePage);

export default router;
