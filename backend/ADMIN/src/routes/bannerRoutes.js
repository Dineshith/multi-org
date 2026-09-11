import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getBanner,
  updateBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

// =====================================
// Upload folder
// =====================================

const uploadDir = "./public/images/home";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================
// Multer Storage
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      file.fieldname + "-" + Date.now() + ext;

    cb(null, filename);
  },
});

// =====================================
// File Filter
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================
// Routes
// =====================================

// Get current banner
router.get("/", getBanner);

// Create / Update banner
router.put("/", upload.single("image"), updateBanner);

export default router;