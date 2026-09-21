import express from "express";

import {
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    logout
} from "../controllers/authcontroller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Super Admin login
router.post("/login", login);

// Logged-in Super Admin profile
router.get("/profile", authMiddleware, getProfile);

// Super Admin forgot password
router.post("/forgot-password", forgotPassword);

// Super Admin reset password
router.post("/reset-password", resetPassword);

// Super Admin logout
router.post("/logout", authMiddleware, logout);

export default router;