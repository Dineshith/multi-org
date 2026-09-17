import pool from "../../config/db.js";
import generateSlug from "../../utils/generateSlug.js";

export const createOrganization = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      email,
      phone,
      address,
      map_link,
      logo_url,
      website,
      why_us,
      status,
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }
    }
    if (phone) {
      const phoneRegex = /^(?:\+977|977)?9[6-8]\d{8}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Invalid Nepal phone number",
        });
      }
    }
    const slug = await generateSlug(name, pool);
    const sql = `
  INSERT INTO organizations
  (
    name,
    slug,
    type,
    description,
    email,
    phone,
    address,
    map_link,
    logo_url,
    website,
    why_us,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      name,
      slug,
      type,
      description || null,
      email || null,
      phone || null,
      address || null,
      map_link || null,
      logo_url || null,
      website || null,
      why_us || null,
      status || "active",
    ];

    const [result] = await pool.execute(sql, values);

    res.status(201).json({
      message: "Organization created successfully",
      organizationId: result.insertId,
    });
  } catch (error) {
    console.error("Create organization error:", error);

    res.status(500).json({
      message: "Failed to create organization",
      error: error.message,
    });
  }
};
export const getAllOrganizations = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT *
      FROM organizations
      ORDER BY id DESC
    `);

    res.status(200).json({
      message: "Organizations fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Get all organizations error:", error);

    res.status(500).json({
      message: "Failed to fetch organizations",
    });
  }
};
export const getOrganizationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
console.log(slug);

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM organizations
      WHERE slug = ?
      LIMIT 1
      `,
      [slug],
    );
console.log(rows)
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    res.status(200).json({
      message: "Organization fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Get organization by slug error:", error);

    res.status(500).json({
      message: "Failed to fetch organization",
    });
  }
};
export const updateOrganization = async (req, res) => {
  try {
    const { slug } = req.params;

    const {
      name,
      type,
      description,
      email,
      phone,
      address,
      map_link,
      logo_url,
      website,
      why_us,
      status,
    } = req.body;

    // Check organization exists
    const [existing] = await pool.execute(
      `
      SELECT *
      FROM organizations
      WHERE slug = ?
      LIMIT 1
      `,
      [slug],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }
    }

    // Nepal phone validation
    if (phone) {
      const phoneRegex = /^(?:\+977|977)?9[6-8]\d{8}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Invalid Nepal phone number",
        });
      }
    }

    // Validate why_us
    let whyUsData = null;

    if (why_us) {
      try {
        whyUsData = typeof why_us === "string" ? JSON.parse(why_us) : why_us;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid why_us JSON",
        });
      }
    }

    // Generate new slug only if name is changed
    let newSlug = slug;

    if (name && name !== existing[0].name) {
      newSlug = await generateSlug(name, pool);
    }

    const sql = `
      UPDATE organizations
      SET
        name = ?,
        slug = ?,
        type = ?,
        description = ?,
        email = ?,
        phone = ?,
        address = ?,
        map_link = ?,
        logo_url = ?,
        website = ?,
        why_us = ?,
        status = ?
      WHERE slug = ?
    `;

    const values = [
      name ?? existing[0].name,
      newSlug,
      type ?? existing[0].type,
      description ?? existing[0].description,
      email ?? existing[0].email,
      phone ?? existing[0].phone,
      address ?? existing[0].address,
      map_link ?? existing[0].map_link,
      logo_url ?? existing[0].logo_url,
      website ?? existing[0].website,

      why_us !== undefined ? JSON.stringify(whyUsData) : existing[0].why_us,

      status ?? existing[0].status,

      slug,
    ];

    await pool.execute(sql, values);

    res.status(200).json({
      message: "Organization updated successfully",
      slug: newSlug,
    });
  } catch (error) {
    console.error("Update organization error:", error);

    res.status(500).json({
      message: "Failed to update organization",
    });
  }
};
export const deleteOrganization = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check organization exists
    const [existing] = await pool.execute(
      `
      SELECT id
      FROM organizations
      WHERE slug = ?
      LIMIT 1
      `,
      [slug],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    await pool.execute(
      `
      DELETE FROM organizations
      WHERE slug = ?
      `,
      [slug],
    );

    res.status(200).json({
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Delete organization error:", error);

    res.status(500).json({
      message: "Failed to delete organization",
    });
  }
};
