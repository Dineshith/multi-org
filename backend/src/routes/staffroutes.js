import express from "express";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staffController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getAllStaff);
router.get("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getStaffById);
router.post("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createStaff);
router.put("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateStaff);
router.delete("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteStaff);

export default router;
