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

router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createStaff);
router.put("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateStaff);
router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteStaff);

export default router;
