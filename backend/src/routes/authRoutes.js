import express from "express";
import { login, getProfile } from "../controllers/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", login);

// Logged-in admin profile
router.get("/profile", authMiddleware, getProfile);

export default router;