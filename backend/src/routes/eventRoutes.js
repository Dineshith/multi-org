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

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getAllEvents);
router.get("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getEventById);
router.post("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), createEvent);
router.put("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), updateEvent);
router.delete("/:id", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), deleteEvent);

export default router;
