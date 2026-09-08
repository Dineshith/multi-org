import express from "express";
import { createContact, getAllContacts, getContactById, deleteContact } from "../controllers/contactController.js";

const router = express.Router();

// Public - user submits contact form
router.post("/", createContact);

// Admin - view contact messages
router.get("/", getAllContacts);

// Admin - view single message
router.get("/:id", getContactById);

// Admin - delete message
router.delete("/:id", deleteContact);

export default router;