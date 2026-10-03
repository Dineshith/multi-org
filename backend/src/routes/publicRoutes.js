import express from "express";
import {
  getPublicEvents,
  getPublicNotices,
  getPublicOrganization,
  getPublicPageBySlug,
  getPublicPages,
} from "../controllers/publicController.js";

const router = express.Router();

// No authMiddleware / roleMiddleware here on purpose: these routes are
// consumed by the unauthenticated public tenant site.

// Organization + branding/footer, resolved by slug
router.get("/organizations/:slug", getPublicOrganization);

// Page list used to build the public navbar
router.get("/organizations/:slug/pages", getPublicPages);

// A single page with its rendered sections
router.get("/organizations/:slug/pages/:pageSlug", getPublicPageBySlug);

// Published notices for the tenant
router.get("/organizations/:slug/notices", getPublicNotices);

// Events for the tenant
router.get("/organizations/:slug/events", getPublicEvents);

export default router;