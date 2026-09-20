import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireRoles from "../../middleware/roleMiddleware.js";
import { createContentAdmin } from "../../controllers/admin/userController.js";

const userRoute = express.Router();

userRoute.post(
    "/content-admins",
    authMiddleware,
    requireRoles("ADMIN"),
    createContentAdmin
);

export default userRoute;