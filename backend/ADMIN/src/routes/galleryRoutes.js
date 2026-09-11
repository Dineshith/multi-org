import express from "express";

import {
  getGallery,
  getGalleryById,
  addGallery,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController.js";

import upload from "../middleware/multerconfig.js";

const router = express.Router();

// =====================================
// GET ALL GALLERIES
// =====================================
router.get("/", getGallery);

// =====================================
// GET SINGLE GALLERY
// =====================================
router.get("/:id", getGalleryById);

// =====================================
// ADD GALLERY
// =====================================
router.post("/", upload.single("image"), addGallery);

// =====================================
// UPDATE GALLERY
// =====================================
router.put("/:id", upload.single("image"), updateGallery);

// =====================================
// DELETE GALLERY
// =====================================
router.delete("/:id", deleteGallery);

export default router;