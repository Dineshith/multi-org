import db from "../config/db.js";

// =====================================
// GET ALL GALLERY
// =====================================
export const getGallery = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        title,
        description,
        createdAt,
        updatedAt
       FROM gallery
       ORDER BY id DESC`
    );

    return res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      data: rows,
    });

  } catch (error) {
    console.error("Get gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};


// =====================================
// GET SINGLE GALLERY
// =====================================
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT 
        id,
        title,
        description,
        createdAt,
        updatedAt
       FROM gallery
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      data: rows[0],
    });

  } catch (error) {
    console.error("Get gallery by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};


// =====================================
// ADD GALLERY
// =====================================
export const addGallery = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO gallery
       (title, description)
       VALUES (?, ?)`,
      [
        title,
        description || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Gallery added successfully",
      data: {
        id: result.insertId,
        title,
        description: description || null,
      },
    });

  } catch (error) {
    console.error("Add gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add gallery",
      error: error.message,
    });
  }
};


// =====================================
// UPDATE GALLERY
// =====================================
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check existing gallery
    const [existing] = await db.query(
      `SELECT *
       FROM gallery
       WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const oldGallery = existing[0];

    // Update title and description
    const updatedTitle =
      title !== undefined ? title : oldGallery.title;

    const updatedDescription =
      description !== undefined
        ? description
        : oldGallery.description;

    await db.query(
      `UPDATE gallery
       SET
         title = ?,
         description = ?
       WHERE id = ?`,
      [
        updatedTitle,
        updatedDescription,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: {
        id,
        title: updatedTitle,
        description: updatedDescription,
      },
    });

  } catch (error) {
    console.error("Update gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update gallery",
      error: error.message,
    });
  }
};


// =====================================
// DELETE GALLERY
// =====================================
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    // Check existing gallery
    const [existing] = await db.query(
      `SELECT id
       FROM gallery
       WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // Delete gallery
    await db.query(
      `DELETE FROM gallery
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
    });

  } catch (error) {
    console.error("Delete gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery",
      error: error.message,
    });
  }
};