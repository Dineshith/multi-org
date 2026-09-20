import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireRoles from "../../middleware/roleMiddleware.js";
import {
    getAllContent,
    createContent,
    updateContent,
    deleteContent
} from "../../controllers/admin/contentController.js";

const contentRoute = express.Router();
const contentAccess = [authMiddleware, requireRoles("ADMIN", "CONTENT_ADMIN")];

contentRoute.get("/:resource", ...contentAccess, getAllContent);
contentRoute.post("/:resource", ...contentAccess, createContent);
contentRoute.put("/:resource/:id", ...contentAccess, updateContent);
contentRoute.delete("/:resource/:id", ...contentAccess, deleteContent);

export default contentRoute;