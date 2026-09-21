import express from "express";

import {
    createOrganization,
    deleteOrganization,
    getAllOrganizations,
    getOrganizationBySlug,
    updateOrganization
} from "../../controllers/admin/organizationController.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const organizationRoute = express.Router();

organizationRoute.post(
    "/create-organization",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    createOrganization
);

organizationRoute.get(
    "/get-all-organization",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    getAllOrganizations
);

organizationRoute.get(
    "/get-organization-by-slug/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    getOrganizationBySlug
);

organizationRoute.put(
    "/update-organization/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    updateOrganization
);

organizationRoute.delete(
    "/delete-organization/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    deleteOrganization
);

export default organizationRoute;