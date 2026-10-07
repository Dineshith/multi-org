import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteEvent);

export default router;
