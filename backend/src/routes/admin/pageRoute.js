import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireRoles from "../../middleware/roleMiddleware.js";
import {
    updateOrganizationProfile,
    createGallery,
    createGalleryImage
} from "../../controllers/admin/pageController.js";
import {
    getFeeStructures,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    getAdmissionCriteria,
    createAdmissionCriteria
} from "../../controllers/admin/academicController.js";

const pageRoute = express.Router();
const contentAccess = [authMiddleware, requireRoles("ADMIN", "CONTENT_ADMIN")];

pageRoute.patch("/organization-profile", ...contentAccess, updateOrganizationProfile);
pageRoute.post("/galleries", ...contentAccess, createGallery);
pageRoute.post("/galleries/:galleryId/images", ...contentAccess, createGalleryImage);
pageRoute.get("/fee-structures", ...contentAccess, getFeeStructures);
pageRoute.post("/fee-structures", ...contentAccess, createFeeStructure);
pageRoute.put("/fee-structures/:id", ...contentAccess, updateFeeStructure);
pageRoute.delete("/fee-structures/:id", ...contentAccess, deleteFeeStructure);
pageRoute.get("/admission-criteria", ...contentAccess, getAdmissionCriteria);
pageRoute.post("/admission-criteria", ...contentAccess, createAdmissionCriteria);

export default pageRoute;