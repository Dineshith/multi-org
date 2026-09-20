import express from "express";
import {
	getOrganizationHome,
	getOrganizationAbout,
	getOrganizationGallery,
	getOrganizationEvents,
	getOrganizationAcademic,
	getOrganizationProgram
} from "../controllers/publicController.js";
import { submitContactMessage } from "../controllers/contactController.js";

const router = express.Router();

router.get("/organizations/:slug/home", getOrganizationHome);
router.get("/organizations/:slug/about", getOrganizationAbout);
router.get("/organizations/:slug/gallery", getOrganizationGallery);
router.get("/organizations/:slug/events", getOrganizationEvents);
router.get("/organizations/:slug/academic", getOrganizationAcademic);
router.get("/organizations/:slug/academic/programs/:programId", getOrganizationProgram);
router.post("/organizations/:slug/contact", submitContactMessage);

export default router;