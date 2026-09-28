import db from "../config/db.js";
import generateSlug from "../utils/generateSlug.js";

const getOrgFilter = (req) => {
  const user = req.user;
  if (user.role === "SUPER_ADMIN") {
    return { orgId: null, scoped: false };
  }
  return { orgId: user.organization_id, scoped: true };
};

const getAllNews = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `SELECT * FROM news WHERE organization_id = ? ORDER BY created_at DESC`;
      params = [orgId];
    } else {
      query = `SELECT * FROM news ORDER BY created_at DESC`;
      params = [];
    }

    const [news] = await db.query(query, params);

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
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `SELECT * FROM news WHERE id = ? AND organization_id = ? LIMIT 1`;
      params = [id, orgId];
    } else {
      query = `SELECT * FROM news WHERE id = ? LIMIT 1`;
      params = [id];
    }

    const [news] = await db.query(query, params);

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

const createNews = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      published,
      publish_on_main_portal,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const organization_id = scoped ? orgId : req.body.organization_id;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: "Organization is required",
      });
    }

    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = generateSlug(title, pool);
    }

    const isPublished = published === true || published === "true";
    const published_at = isPublished ? new Date() : null;

    const [result] = await db.query(
      `INSERT INTO news
        (organization_id, title, slug, excerpt, content, featured_image, published, published_at, publish_on_main_portal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        organization_id,
        title,
        finalSlug,
        excerpt || null,
        content || null,
        featured_image || null,
        isPublished,
        published_at,
        publish_on_main_portal === true || publish_on_main_portal === "true",
      ],
    );

    res.status(201).json({
      success: true,
      message: "News created successfully",
      newsId: result.insertId,
      slug: finalSlug,
    });
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create news",
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let checkQuery, checkParams;
    if (scoped) {
      checkQuery = `SELECT * FROM news WHERE id = ? AND organization_id = ? LIMIT 1`;
      checkParams = [id, orgId];
    } else {
      checkQuery = `SELECT * FROM news WHERE id = ? LIMIT 1`;
      checkParams = [id];
    }

    const [existing] = await db.query(checkQuery, checkParams);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const news = existing[0];

    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      published,
      publish_on_main_portal,
    } = req.body;

    let finalSlug = slug;
    if (!finalSlug && title && title !== news.title) {
      finalSlug = await generateSlug(title, db);
    } else if (!finalSlug) {
      finalSlug = news.slug;
    }

    const isPublished =
      published !== undefined
        ? published === true || published === "true"
        : news.published;

    let published_at = news.published_at;
    if (isPublished && !news.published_at) {
      published_at = new Date();
    } else if (!isPublished) {
      published_at = null;
    }

    await db.query(
      `UPDATE news SET
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        featured_image = ?,
        published = ?,
        published_at = ?,
        publish_on_main_portal = ?
      WHERE id = ?`,
      [
        title ?? news.title,
        finalSlug,
        excerpt ?? news.excerpt,
        content ?? news.content,
        featured_image ?? news.featured_image,
        isPublished,
        published_at,
        publish_on_main_portal !== undefined
          ? publish_on_main_portal === true || publish_on_main_portal === "true"
          : news.publish_on_main_portal,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      slug: finalSlug,
    });
  } catch (error) {
    console.error("Update news error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `DELETE FROM news WHERE id = ? AND organization_id = ?`;
      params = [id, orgId];
    } else {
      query = `DELETE FROM news WHERE id = ?`;
      params = [id];
    }

    const [result] = await db.query(query, params);

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
