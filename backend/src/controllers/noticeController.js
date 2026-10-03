import db from "../config/db.js";

const getOrgFilter = (req) => {
  const user = req.user;
  if (user.role === "SUPER_ADMIN") {
    return { orgId: null, scoped: false };
  }
  return { orgId: user.organization_id, scoped: true };
};

const getAllNotices = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;

    if (scoped) {
      query = `SELECT * FROM notices WHERE organization_id = ? ORDER BY created_at DESC`;
      params = [orgId];
    } else {
      query = `SELECT * FROM notices ORDER BY created_at DESC`;
      params = [];
    }

    const [notices] = await db.query(query, params);

    res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error("Get notices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `SELECT * FROM notices WHERE id = ? AND organization_id = ? LIMIT 1`;
      params = [id, orgId];
    } else {
      query = `SELECT * FROM notices WHERE id = ? LIMIT 1`;
      params = [id];
    }

    const [notices] = await db.query(query, params);

    if (notices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      notice: notices[0],
    });
  } catch (error) {
    console.error("Get notice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notice",
    });
  }
};

const createNotice = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    const { title, content, image_url, published, publish_on_main_portal } = req.body;

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

    const isPublished = published === true || published === "true";
    const published_at = isPublished ? new Date() : null;

    const [result] = await db.query(
      `INSERT INTO notices
        (organization_id, title, content, image_url, published, published_at, publish_on_main_portal)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        organization_id,
        title,
        content || null,
        image_url || null,
        isPublished,
        published_at,
        publish_on_main_portal === true || publish_on_main_portal === "true",
      ],
    );

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      noticeId: result.insertId,
    });
  } catch (error) {
    console.error("Create notice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let checkQuery, checkParams;
    if (scoped) {
      checkQuery = `SELECT * FROM notices WHERE id = ? AND organization_id = ? LIMIT 1`;
      checkParams = [id, orgId];
    } else {
      checkQuery = `SELECT * FROM notices WHERE id = ? LIMIT 1`;
      checkParams = [id];
    }

    const [existing] = await db.query(checkQuery, checkParams);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const notice = existing[0];

    const { title, content, image_url, published, publish_on_main_portal } = req.body;

    const isPublished =
      published !== undefined
        ? published === true || published === "true"
        : notice.published;

    let published_at = notice.published_at;
    if (isPublished && !notice.published_at) {
      published_at = new Date();
    } else if (!isPublished) {
      published_at = null;
    }

    await db.query(
      `UPDATE notices SET
        title = ?,
        content = ?,
        image_url = ?,
        published = ?,
        published_at = ?,
        publish_on_main_portal = ?
      WHERE id = ?`,
      [
        title ?? notice.title,
        content ?? notice.content,
        image_url !== undefined ? image_url : notice.image_url,
        isPublished,
        published_at,
        publish_on_main_portal !== undefined
          ? publish_on_main_portal === true || publish_on_main_portal === "true"
          : notice.publish_on_main_portal,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
    });
  } catch (error) {
    console.error("Update notice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `DELETE FROM notices WHERE id = ? AND organization_id = ?`;
      params = [id, orgId];
    } else {
      query = `DELETE FROM notices WHERE id = ?`;
      params = [id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete notice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
};

export {
  createNotice,
  deleteNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
};
