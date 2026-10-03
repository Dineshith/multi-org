import express from "express";
import {
  getDashboardData,
  getDashboardStats,
  getDashboardNotices,
  getDashboardEvents,
} from "../../controllers/admin/dashboardController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication and proper admin role
router.use(authMiddleware);
router.use(roleMiddleware("SUPER_ADMIN", "ORG_ADMIN", "EDITOR"));

// GET /api/admin/dashboard - full overview
router.get("/", getDashboardData);

// GET /api/admin/dashboard/stats - key counts and card values
router.get("/stats", getDashboardStats);

// GET /api/admin/dashboard/notices - recent notices widget
router.get("/notices", getDashboardNotices);

// GET /api/admin/dashboard/events - upcoming events widget
router.get("/events", getDashboardEvents);

export default router;
