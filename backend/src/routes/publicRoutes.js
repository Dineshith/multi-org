import express from "express";
import {
  getPublicEvents,
  getPublicNotices,
  getPublicNews,
  getPublicOrganization,
  getPublicPageBySlug,
  getPublicPages,
} from "../controllers/publicController.js";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/organizations/:slug", getPublicOrganization);

router.get("/organizations/:slug/pages", getPublicPages);

router.get("/organizations/:slug/pages/:pageSlug", getPublicPageBySlug);

router.get("/organizations/:slug/notices", getPublicNotices);

router.get("/organizations/:slug/events", getPublicEvents);

router.get("/organizations/:slug/news", getPublicNews);

// Public contact endpoints
router.post("/contact", createContact);
router.post("/organizations/:slug/contact", createContact);

export default router;
