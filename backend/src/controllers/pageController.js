import db from "../config/db.js";
import generateSlug from "../utils/generateSlug.js";

const parseJson = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Normalizes page sections/dropdowns for a stable API shape.
const shapePage = (page) => ({
  ...page,
  sections: parseJson(page.sections, []),
  dropdownItems: parseJson(page.dropdown_items, []),
});

const getOrgFilter = (req) => {
  const user = req.user;
  if (user.role === "SUPER_ADMIN") return { orgId: null, scoped: false };
  return { orgId: user.organization_id, scoped: true };
};

const getAllPages = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `SELECT * FROM pages WHERE organization_id = ? ORDER BY created_at DESC`;
      params = [orgId];
    } else {
      query = `SELECT * FROM pages ORDER BY created_at DESC`;
      params = [];
    }
    const [pages] = await db.query(query, params);
    res.status(200).json({ success: true, pages: pages.map(shapePage) });
  } catch (error) {
    console.error("Get pages error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pages" });
  }
};

const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `SELECT * FROM pages WHERE id = ? AND organization_id = ? LIMIT 1`;
      params = [id, orgId];
    } else {
      query = `SELECT * FROM pages WHERE id = ? LIMIT 1`;
      params = [id];
    }
    const [pages] = await db.query(query, params);
    if (pages.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res.status(200).json({ success: true, page: shapePage(pages[0]) });
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch page" });
  }
};

const createPage = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    const { title, slug, sections, dropdown_items } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    const organization_id = scoped ? orgId : req.body.organization_id;
    if (!organization_id) {
      return res
        .status(400)
        .json({ success: false, message: "Organization is required" });
    }
    let finalSlug = slug || (await generateSlug(title, db));
    const [result] = await db.query(
      `INSERT INTO pages (organization_id, title, slug, sections, dropdown_items) VALUES (?, ?, ?, ?, ?)`,
      [
        organization_id,
        title,
        finalSlug,
        sections ? JSON.stringify(sections) : null,
        JSON.stringify(dropdown_items || []),
      ],
    );
    res.status(201).json({
      success: true,
      message: "Page created successfully",
      pageId: result.insertId,
      slug: finalSlug,
    });
  } catch (error) {
    console.error("Create page error:", error);
    res.status(500).json({ success: false, message: "Failed to create page" });
  }
};

const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let checkQuery;
    let checkParams;

    if (scoped) {
      checkQuery = `
        SELECT *
        FROM pages
        WHERE id = ? AND organization_id = ?
        LIMIT 1
      `;
      checkParams = [id, orgId];
    } else {
      checkQuery = `
        SELECT *
        FROM pages
        WHERE id = ?
        LIMIT 1
      `;
      checkParams = [id];
    }

    const [existing] = await db.query(checkQuery, checkParams);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const page = existing[0];

    const title = req.body.title ?? page.title;

    let finalSlug = page.slug;

    if (req.body.slug) {
      finalSlug = req.body.slug;
    } else if (req.body.title && req.body.title !== page.title) {
      finalSlug = await generateSlug(req.body.title, db);
    }

    let sectionsValue = null;

    if (req.body.sections !== undefined) {
      sectionsValue = JSON.stringify(req.body.sections);
    } else if (page.sections !== null) {
      sectionsValue = JSON.stringify(parseJson(page.sections, []));
    }

    let dropdownItemsValue = JSON.stringify(
      req.body.dropdown_items !== undefined
        ? req.body.dropdown_items
        : parseJson(page.dropdown_items, [])
    );

    await db.query(
      `UPDATE pages
       SET title = ?, slug = ?, sections = ?, dropdown_items = ?
       WHERE id = ?`,
      [
        title,
        finalSlug,
        sectionsValue,
        dropdownItemsValue,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      slug: finalSlug,
    });

  } catch (error) {
    console.error("Update page error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update page",
    });
  }
};
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `DELETE FROM pages WHERE id = ? AND organization_id = ?`;
      params = [id, orgId];
    } else {
      query = `DELETE FROM pages WHERE id = ?`;
      params = [id];
    }
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({ success: false, message: "Failed to delete page" });
  }
};

export { createPage, deletePage, getAllPages, getPageById, updatePage };
