import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"), getSettings);

router.put("/", roleMiddleware("SUPER_ADMIN"), updateSettings);

export default router;
