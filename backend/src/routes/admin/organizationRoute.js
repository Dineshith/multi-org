import express from "express";

import {
    createOrganization,
    deleteOrganization,
    getAllOrganizations,
    getOrganizationById,
    getOrganizationBySlug,
    updateOrganization
} from "../../controllers/admin/organizationController.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const organizationRoute = express.Router();

// Create organization
organizationRoute.post(
    "/create-organization",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    createOrganization
);

// Get all organizations - public
organizationRoute.get(
    "/get-all-organization",
    getAllOrganizations
);

// Get organization by ID - public
organizationRoute.get(
    "/get-organization-by-id/:id",
    getOrganizationById
);

// Get organization by slug - public
organizationRoute.get(
    "/get-organization-by-slug/:slug",
    getOrganizationBySlug
);

// Update organization
organizationRoute.put(
    "/update-organization/:slug",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN", "ORG_ADMIN"),
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