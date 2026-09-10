import db from "../config/db.js";
import fs from "fs";
import path from "path";

// =====================================
// GET BANNER
// =====================================
export const getBanner = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM banner ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No banner found",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get Banner Error:", error);

    res.status(500).json({
      message: "Failed to get banner",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE / CREATE BANNER
// =====================================
export const updateBanner = async (req, res) => {
  try {
    const { name } = req.body;

    // Uploaded image
    const newImage = req.file ? req.file.filename : null;

    // Check existing banner
    const [rows] = await db.query(
      "SELECT * FROM banner ORDER BY id DESC LIMIT 1"
    );

    // =====================================
    // IF NO BANNER EXISTS -> INSERT
    // =====================================
    if (rows.length === 0) {
      if (!newImage) {
        return res.status(400).json({
          message: "Banner image is required",
        });
      }

      await db.query(
        `INSERT INTO banner (name, img, createdAt, updatedAt)
         VALUES (?, ?, NOW(), NOW())`,
        [name || "Banner", newImage]
      );

      return res.status(201).json({
        message: "Banner created successfully",
        image: newImage,
      });
    }

    // =====================================
    // EXISTING BANNER -> UPDATE
    // =====================================
    const oldBanner = rows[0];

    const imageToSave = newImage || oldBanner.img;
    const nameToSave = name || oldBanner.name;

    await db.query(
      `UPDATE banner
       SET name = ?, img = ?, updatedAt = NOW()
       WHERE id = ?`,
      [nameToSave, imageToSave, oldBanner.id]
    );

    // =====================================
    // DELETE OLD IMAGE
    // =====================================
    if (newImage && oldBanner.img) {
      const oldImagePath = path.join(
        "./public/images/home",
        oldBanner.img
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.status(200).json({
      message: "Banner updated successfully",
      banner: {
        id: oldBanner.id,
        name: nameToSave,
        img: imageToSave,
      },
    });
  } catch (error) {
    console.error("Update Banner Error:", error);

    res.status(500).json({
      message: "Failed to update banner",
      error: error.message,
    });
  }
};