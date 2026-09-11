import express from "express";

import {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
} from "../controllers/contactController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// =====================================
// PUBLIC ROUTE
// User can send contact message
// =====================================
router.post("/", createContact);


// =====================================
// ADMIN ROUTES
// =====================================

// Get all contact messages
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllContacts
);

// Get single contact message
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getContactById
);

// Delete contact message
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteContact
);

export default router;