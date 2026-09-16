import express from "express";
import { createOrganization, deleteOrganization, getAllOrganizations, getOrganizationBySlug, updateOrganization } from "../../controllers/admin/organizationController.js";
const organizationRoute = express.Router();
organizationRoute.post("/create-organization", createOrganization);
organizationRoute.get("/get-all-organization", getAllOrganizations);
organizationRoute.get("/get-organization-by-slug/:slug", getOrganizationBySlug);
organizationRoute.put("/update-organization/:slug", updateOrganization);
organizationRoute.delete("/delete-organization/:slug", deleteOrganization);
export default organizationRoute;
