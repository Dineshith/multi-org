import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from "../controllers/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createContact);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  getAllContacts,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  getContactById,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
  deleteContact,
);

export default router;
