import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/get-all-user", roleMiddleware("SUPER_ADMIN"), getAllUsers);
router.get("/:id", roleMiddleware("SUPER_ADMIN"), getUserById);
router.post("/", roleMiddleware("SUPER_ADMIN"), createUser);
router.put("/:id", roleMiddleware("SUPER_ADMIN"), updateUser);
router.delete("/:id", roleMiddleware("SUPER_ADMIN"), deleteUser);

export default router;
