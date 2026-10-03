import express from "express";
import {
  getPublicEvents,
  getPublicNotices,
  getPublicOrganization,
  getPublicPageBySlug,
  getPublicPages,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/organizations/:slug", getPublicOrganization);

router.get("/organizations/:slug/pages", getPublicPages);

router.get("/organizations/:slug/pages/:pageSlug", getPublicPageBySlug);

router.get("/organizations/:slug/notices", getPublicNotices);

router.get("/organizations/:slug/events", getPublicEvents);

export default router;
