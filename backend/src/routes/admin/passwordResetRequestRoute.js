import express from "express";

import {
  getAllPasswordResetRequests,
  getPasswordResetRequestById,
  updatePasswordResetRequest,
} from "../../controllers/passwordResetRequestController.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Only super admins triage the queue.
router.use(authMiddleware);
router.use(roleMiddleware("SUPER_ADMIN"));

router.get("/", getAllPasswordResetRequests);
router.get("/:id", getPasswordResetRequestById);
router.put("/:id", updatePasswordResetRequest);

export default router;