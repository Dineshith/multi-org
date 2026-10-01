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

// GET all galleries
router.get("/", getGallery);

// GET single gallery
router.get("/:id", getGalleryById);

// ADD gallery
router.post("/", upload.single("image"), addGallery);

// UPDATE gallery
router.put("/:id", upload.single("image"), updateGallery);

// DELETE gallery
router.delete("/:id", deleteGallery);

export default router;