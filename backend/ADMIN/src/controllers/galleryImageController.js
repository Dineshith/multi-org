import db from "../config/db.js";
import fs from "fs";
import path from "path";

// =====================================
// GET ALL GALLERY IMAGES
// =====================================

export const getGalleryImages = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        mediaUrl,
        mediaType,
        galleryId,
        createdAt
      FROM galleryimage
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Gallery images fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Get gallery images error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images",
      error: error.message,
    });
  }
};

// =====================================
// GET IMAGES BY GALLERY
// =====================================

export const getImagesByGallery = async (req, res) => {
  try {
    const { galleryId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        mediaUrl,
        mediaType,
        galleryId,
        createdAt
      FROM galleryimage
      WHERE galleryId = ?
      ORDER BY id DESC
      `,
      [galleryId]
    );

    return res.status(200).json({
      success: true,
      message: "Gallery images fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Get images by gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images",
      error: error.message,
    });
  }
};

// =====================================
// ADD GALLERY IMAGE
// =====================================

export const addGalleryImage = async (req, res) => {
  try {
    const { galleryId } = req.body;

    // Check galleryId
    if (!galleryId) {
      return res.status(400).json({
        success: false,
        message: "galleryId is required",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Check gallery exists
    const [gallery] = await db.query(
      `
      SELECT id
      FROM gallery
      WHERE id = ?
      `,
      [galleryId]
    );

    if (gallery.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // Image URL
    const mediaUrl = `/images/gallery/${req.file.filename}`;

    // Media type is always image
    const mediaType = "image";

    // Insert into database
    const [result] = await db.query(
      `
      INSERT INTO galleryimage
      (mediaUrl, mediaType, galleryId)
      VALUES (?, ?, ?)
      `,
      [mediaUrl, mediaType, galleryId]
    );

    return res.status(201).json({
      success: true,
      message: "Gallery image added successfully",
      data: {
        id: result.insertId,
        mediaUrl,
        mediaType,
        galleryId,
      },
    });
  } catch (error) {
    console.error("Add gallery image error:", error);

    // Delete uploaded file if DB insert fails
    if (req.file) {
      const uploadedFilePath = path.join(
        process.cwd(),
        "public",
        "images",
        "gallery",
        req.file.filename
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add gallery image",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE GALLERY IMAGE
// =====================================

export const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing image
    const [existing] = await db.query(
      `
      SELECT
        id,
        mediaUrl,
        mediaType,
        galleryId
      FROM galleryimage
      WHERE id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    // =====================================
    // NEW IMAGE UPLOADED
    // =====================================

    if (req.file) {
      const newMediaUrl = `/images/gallery/${req.file.filename}`;

      // Media type always image
      const mediaType = "image";

      // Update database
      await db.query(
        `
        UPDATE galleryimage
        SET
          mediaUrl = ?,
          mediaType = ?
        WHERE id = ?
        `,
        [newMediaUrl, mediaType, id]
      );

      // Delete old physical image
      if (existing[0].mediaUrl) {
        const oldMediaPath = path.join(
          process.cwd(),
          "public",
          existing[0].mediaUrl.replace(/^[/\\]+/, "")
        );

        if (fs.existsSync(oldMediaPath)) {
          fs.unlinkSync(oldMediaPath);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Gallery image updated successfully",
        data: {
          id: Number(id),
          mediaUrl: newMediaUrl,
          mediaType: "image",
          galleryId: existing[0].galleryId,
        },
      });
    }

    // =====================================
    // NO NEW IMAGE
    // =====================================

    return res.status(400).json({
      success: false,
      message: "Please upload a new image to update",
    });
  } catch (error) {
    console.error("Update gallery image error:", error);

    // Delete newly uploaded file if update fails
    if (req.file) {
      const uploadedFilePath = path.join(
        process.cwd(),
        "public",
        "images",
        "gallery",
        req.file.filename
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update gallery image",
      error: error.message,
    });
  }
};

// =====================================
// DELETE GALLERY IMAGE
// =====================================

export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find image
    const [existing] = await db.query(
      `
      SELECT mediaUrl
      FROM galleryimage
      WHERE id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    // Delete physical image
    if (existing[0].mediaUrl) {
      const mediaPath = path.join(
        process.cwd(),
        "public",
        existing[0].mediaUrl.replace(/^[/\\]+/, "")
      );

      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }

    // Delete database record
    await db.query(
      `
      DELETE FROM galleryimage
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery image",
      error: error.message,
    });
  }
};