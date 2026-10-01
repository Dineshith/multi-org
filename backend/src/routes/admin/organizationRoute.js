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

// Create organization
organizationRoute.post(
    "/create-organization",
    // authMiddleware,
    // roleMiddleware("SUPER_ADMIN"),
    createOrganization
);

// Get all organizations
organizationRoute.get(
    "/get-all-organization",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    getAllOrganizations
);

// Get organization by slug
organizationRoute.get(
    "/get-organization-by-slug/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    getOrganizationBySlug
);

// Update organization
organizationRoute.put(
    "/update-organization/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    updateOrganization
);

// Delete organization
organizationRoute.delete(
    "/delete-organization/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    deleteOrganization
);

export default organizationRoute;