import db from "../config/db.js";

const getAllNews = async (req, res) => {
  try {
    const [news] = await db.query(`
            SELECT
                n.*,
                o.name AS organization_name,
                nc.name AS category_name
            FROM news n
            LEFT JOIN organizations o
                ON n.organization_id = o.id
            LEFT JOIN news_categories nc
                ON n.category_id = nc.id
            ORDER BY n.news_date DESC
        `);

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("Get news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const [news] = await db.query(
      `
            SELECT
                n.*,
                o.name AS organization_name,
                nc.name AS category_name
            FROM news n
            LEFT JOIN organizations o
                ON n.organization_id = o.id
            LEFT JOIN news_categories nc
                ON n.category_id = nc.id
            WHERE n.id = ?
        `,
      [id],
    );

    if (news.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      news: news[0],
    });
  } catch (error) {
    console.error("Get news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// CREATE NEWS
const createNews = async (req, res) => {
  try {
    const {
      organization_id,
      category_id,
      created_by,
      title,
      description,
      image_url,
      news_date,
      status,
    } = req.body;

    if (!organization_id || !title || !news_date) {
      return res.status(400).json({
        success: false,
        message: "Organization, title and news date are required",
      });
    }

    const [result] = await db.query(
      `
            INSERT INTO news
            (
                organization_id,
                category_id,
                created_by,
                title,
                description,
                image_url,
                news_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        organization_id,
        category_id || null,
        created_by || null,
        title,
        description || null,
        image_url || null,
        news_date,
        status || "PUBLISHED",
      ],
    );

    res.status(201).json({
      success: true,
      message: "News created successfully",
      newsId: result.insertId,
    });
  } catch (error) {
    console.error("Create news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create news",
    });
  }
};

// UPDATE NEWS
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      organization_id,
      category_id,
      created_by,
      title,
      description,
      image_url,
      news_date,
      status,
    } = req.body;

    const [result] = await db.query(
      `
            UPDATE news
            SET
                organization_id = ?,
                category_id = ?,
                created_by = ?,
                title = ?,
                description = ?,
                image_url = ?,
                news_date = ?,
                status = ?
            WHERE id = ?
        `,
      [
        organization_id,
        category_id || null,
        created_by || null,
        title,
        description || null,
        image_url || null,
        news_date,
        status,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News updated successfully",
    });
  } catch (error) {
    console.error("Update news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
};

// DELETE NEWS
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM news WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete news",
    });
  }
};

export { createNews, deleteNews, getAllNews, getNewsById, updateNews };
