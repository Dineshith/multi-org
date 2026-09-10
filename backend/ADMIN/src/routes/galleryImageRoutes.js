import express from "express";

import {
  getGalleryImages,
  getImagesByGallery,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryImageController.js";

import upload from "../middleware/multerconfig.js";

const router = express.Router();

// GET all gallery images
router.get("/", getGalleryImages);

// GET images of one gallery
router.get("/gallery/:galleryId", getImagesByGallery);

// ADD gallery image
router.post("/", upload.single("image"), addGalleryImage);

// UPDATE gallery image
router.put("/:id", upload.single("image"), updateGalleryImage);

// DELETE gallery image
router.delete("/:id", deleteGalleryImage);

export default router;