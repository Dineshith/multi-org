import pool from "../../config/db.js";
import generateSlug from "../../utils/generateSlug.js";
const parseJsonColumn = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const serializeJsonColumn = (value, fallback = null) => {
  const parsed =
    typeof value === "string"
      ? parseJsonColumn(value, fallback)
      : value;

  return JSON.stringify(parsed ?? fallback);
};

const normalizeArray = (value) => {
  const parsed = parseJsonColumn(value, []);

  return Array.isArray(parsed) ? parsed : [];
};

const normalizeObject = (value) => {
  const parsed = parseJsonColumn(value, null);

  return parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
    ? parsed
    : null;
};

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim() : "";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeStatus = (status) =>
  status ? String(status).toUpperCase() : "ACTIVE";
const shapeOrganization = (row, allOrgs = []) => {
  const brandingConfig = normalizeObject(row.branding);
  const footerConfig = normalizeObject(row.footer_config);

  let sisterOrgs = normalizeArray(row.sister_organizations);

  // Main Portal dynamically displays active organizations
  // when no sister organizations have been configured.
  if (row.slug === "main-portal" && sisterOrgs.length === 0) {
    sisterOrgs = allOrgs
      .filter(
        (org) =>
          org.slug !== "main-portal" &&
          String(org.status || "ACTIVE").toUpperCase() === "ACTIVE"
      )
      .map((org) => ({
        name: org.name,
        link: `/org/${org.slug}`,
      }));
  }
  const {
    sister_organizations,
    stats_banner,
    branding,
    footer_config,
    ...organizationData
  } = row;

  return {
    ...organizationData,

    branding: {
      logo: row.logo_url || "",
      primaryColor:
        brandingConfig?.primaryColor || "#4f46e5",
      secondaryColor:
        brandingConfig?.secondaryColor || "#f3f4f6",
    },

    statsBanner: normalizeArray(row.stats_banner),

    sisterOrganizations: sisterOrgs,

    footer: {
      logo: row.logo_url || "",
      description: row.footer_description || "",
      facultyTitle:
        footerConfig?.facultyTitle || "Faculty",
      facultyDetails:
        footerConfig?.facultyDetails || "",
      contactTitle:
        footerConfig?.contactTitle || "Contact Us",
      contactInfo:
        footerConfig?.contactInfo || "",
      mapUrl: row.map_link || "",
      copyrightText: row.copyright_text || "",
    },
  };
};

// CREATE ORGANIZATION

export const createOrganization = async (req, res) => {
  try {
    const {
      name,
      type,
      email,
      phone,
      logo_url,
      address,
      map_link,
      status,
      footer_description,
      copyright_text,
      branding,
      stats_banner,
      sister_organizations,
      footer_config,
      footer,
      statsBanner,
      sisterOrganizations,
      slug: customSlug,
    } = req.body;

    // Required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof type !== "string" ||
      !type.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Name, type and email are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // Phone validation
    if (phone && String(phone).trim() !== "") {
      const phoneRegex = /^[+]?[\d\s\-().]{6,25}$/;

      if (!phoneRegex.test(String(phone).trim())) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }
    }

    // Status validation
    const normalizedStatus = normalizeStatus(status);

    if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    // CamelCase takes priority over snake_case.
    // An empty array is a valid explicitly supplied value.
    const resolvedStatsBanner = normalizeArray(
      statsBanner !== undefined
        ? statsBanner
        : stats_banner
    );

    const resolvedSisterOrgs = normalizeArray(
      sisterOrganizations !== undefined
        ? sisterOrganizations
        : sister_organizations
    );

    const resolvedBranding = normalizeObject(branding);

    const resolvedFooterConfig = normalizeObject(
      footer_config !== undefined
        ? footer_config
        : footer
          ? {
              facultyTitle:
                footer.facultyTitle || "Faculty",
              facultyDetails:
                footer.facultyDetails || "",
              contactTitle:
                footer.contactTitle || "Contact Us",
              contactInfo:
                footer.contactInfo || "",
            }
          : null
    );

    const resolvedFooterDesc =
      footer_description !== undefined
        ? footer_description
        : footer?.description ?? null;

    const resolvedCopyright =
      copyright_text !== undefined
        ? copyright_text
        : footer?.copyrightText ?? null;

    const resolvedMapLink =
      map_link !== undefined
        ? map_link
        : footer?.mapUrl ?? null;

    const resolvedLogoUrl =
      logo_url !== undefined
        ? logo_url
        : branding?.logo !== undefined
          ? branding.logo
          : footer?.logo ?? null;

    const baseSlug =
      typeof customSlug === "string" && customSlug.trim()
        ? customSlug.trim()
        : name.trim();

    const slug = await generateSlug(baseSlug, pool);

    const sql = `
      INSERT INTO organizations (
        name,
        type,
        slug,
        email,
        phone,
        logo_url,
        address,
        map_link,
        status,
        footer_description,
        copyright_text,
        branding,
        stats_banner,
        sister_organizations,
        footer_config
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name.trim(),
      type.trim(),
      slug,
      normalizedEmail,
      phone && String(phone).trim()
        ? String(phone).trim()
        : null,
      resolvedLogoUrl,
      address || null,
      resolvedMapLink,
      normalizedStatus,
      resolvedFooterDesc,
      resolvedCopyright,
      serializeJsonColumn(resolvedBranding, null),
      serializeJsonColumn(resolvedStatsBanner, []),
      serializeJsonColumn(resolvedSisterOrgs, []),
      serializeJsonColumn(resolvedFooterConfig, null),
    ];

    const [result] = await pool.execute(sql, values);

    // No default pages are created automatically.
    // Existing page-management endpoints remain unchanged.

    return res.status(201).json({
      message: "Organization created successfully",
      organizationId: result.insertId,
      id: result.insertId,
      slug,
      data: {
        id: result.insertId,
        name: name.trim(),
        slug,
        type: type.trim(),
        email: normalizedEmail,
      },
    });
  } catch (error) {
    console.error("Create organization error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "An organization with this information already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create organization",
    });
  }
};


// GET ALL ORGANIZATIONS


export const getAllOrganizations = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT *
      FROM organizations
      ORDER BY id DESC
    `);

    return res.status(200).json({
      message: "Organizations fetched successfully",
      data: rows.map((row) => shapeOrganization(row, rows)),
    });
  } catch (error) {
    console.error("Get all organizations error:", error);

    return res.status(500).json({
      message: "Failed to fetch organizations",
    });
  }
};


// GET ORGANIZATION BY ID


export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT * FROM organizations WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    let allActiveOrgs = [];

    if (rows[0].slug === "main-portal") {
      const [activeRows] = await pool.execute(`
        SELECT id, name, slug, status
        FROM organizations
        WHERE slug != 'main-portal'
          AND status = 'ACTIVE'
        ORDER BY name ASC
      `);

      allActiveOrgs = activeRows;
    }

    return res.status(200).json({
      message: "Organization fetched successfully",
      data: shapeOrganization(rows[0], allActiveOrgs),
    });
  } catch (error) {
    console.error("Get organization by id error:", error);

    return res.status(500).json({
      message: "Failed to fetch organization",
    });
  }
};


// GET ORGANIZATION BY SLUG OR ID


export const getOrganizationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isId = /^\d+$/.test(slug);

    const [rows] = await pool.execute(
      isId
        ? `SELECT * FROM organizations WHERE id = ? LIMIT 1`
        : `SELECT * FROM organizations WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    let allActiveOrgs = [];

    if (rows[0].slug === "main-portal") {
      const [activeRows] = await pool.execute(`
        SELECT id, name, slug, status
        FROM organizations
        WHERE slug != 'main-portal'
          AND status = 'ACTIVE'
        ORDER BY name ASC
      `);

      allActiveOrgs = activeRows;
    }

    return res.status(200).json({
      message: "Organization fetched successfully",
      data: shapeOrganization(rows[0], allActiveOrgs),
    });
  } catch (error) {
    console.error("Get organization by slug error:", error);

    return res.status(500).json({
      message: "Failed to fetch organization",
    });
  }
};


// UPDATE ORGANIZATION


export const updateOrganization = async (req, res) => {
  try {
    const { slug } = req.params;

    const {
      name,
      type,
      email,
      phone,
      logo_url,
      address,
      map_link,
      status,
      footer_description,
      copyright_text,
      branding,
      stats_banner,
      sister_organizations,
      footer_config,
      footer,
      statsBanner,
      sisterOrganizations,
      slug: updatedSlug,
    } = req.body;

    const isId = /^\d+$/.test(slug);

    const [existing] = await pool.execute(
      isId
        ? `SELECT * FROM organizations WHERE id = ? LIMIT 1`
        : `SELECT * FROM organizations WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const organization = existing[0];

    // ORG_ADMIN can update only their own organization.
    if (
      req.user?.role !== "SUPER_ADMIN" &&
      Number(organization.id) !==
        Number(req.user?.organization_id)
    ) {
      return res.status(403).json({
        message: "You can only update your own organization",
      });
    }

    // Validate email only when provided.
    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !isValidEmail(email.trim())
      ) {
        return res.status(400).json({
          message: "Invalid email address",
        });
      }
    }

    if (phone && String(phone).trim() !== "") {
      const phoneRegex = /^[+]?[\d\s\-().]{6,25}$/;

      if (!phoneRegex.test(String(phone).trim())) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }
    }

    const normalizedStatus =
      status !== undefined
        ? String(status).toUpperCase()
        : undefined;

    if (
      normalizedStatus &&
      !["ACTIVE", "INACTIVE"].includes(normalizedStatus)
    ) {
      return res.status(400).json({
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    // Resolve slug.
    let newSlug = organization.slug;

    if (
      typeof updatedSlug === "string" &&
      updatedSlug.trim() &&
      updatedSlug.trim() !== organization.slug
    ) {
      newSlug = await generateSlug(updatedSlug.trim(), pool);
    } else if (
      typeof name === "string" &&
      name.trim() &&
      name.trim() !== organization.name &&
      organization.slug !== "main-portal"
    ) {
      newSlug = await generateSlug(name.trim(), pool);
    }

    // CamelCase has priority when supplied.
    const resolvedStatsBanner =
      statsBanner !== undefined
        ? statsBanner
        : stats_banner;

    const resolvedSisterOrgs =
      sisterOrganizations !== undefined
        ? sisterOrganizations
        : sister_organizations;

    const resolvedFooterConfig =
      footer_config !== undefined
        ? footer_config
        : footer !== undefined
          ? {
              facultyTitle:
                footer.facultyTitle || "Faculty",
              facultyDetails:
                footer.facultyDetails || "",
              contactTitle:
                footer.contactTitle || "Contact Us",
              contactInfo:
                footer.contactInfo || "",
            }
          : undefined;

    const resolvedLogoUrl =
      logo_url !== undefined
        ? logo_url
        : branding?.logo !== undefined
          ? branding.logo
          : footer?.logo;

    const resolvedFooterDesc =
      footer_description !== undefined
        ? footer_description
        : footer?.description;

    const resolvedCopyright =
      copyright_text !== undefined
        ? copyright_text
        : footer?.copyrightText;

    const resolvedMapLink =
      map_link !== undefined
        ? map_link
        : footer?.mapUrl;

    const resolvedBranding =
      branding !== undefined
        ? branding
        : undefined;

    const sql = `
      UPDATE organizations
      SET
        name = ?,
        type = ?,
        slug = ?,
        email = ?,
        phone = ?,
        logo_url = ?,
        address = ?,
        map_link = ?,
        status = ?,
        footer_description = ?,
        copyright_text = ?,
        branding = ?,
        stats_banner = ?,
        sister_organizations = ?,
        footer_config = ?
      WHERE id = ?
    `;

    const values = [
      name ?? organization.name,
      type ?? organization.type,
      newSlug,
      email !== undefined
        ? email.trim()
        : organization.email,
      phone !== undefined
        ? phone && String(phone).trim()
          ? String(phone).trim()
          : null
        : organization.phone,
      resolvedLogoUrl !== undefined
        ? resolvedLogoUrl
        : organization.logo_url,
      address ?? organization.address,
      resolvedMapLink !== undefined
        ? resolvedMapLink
        : organization.map_link,
      normalizedStatus ?? organization.status,
      resolvedFooterDesc !== undefined
        ? resolvedFooterDesc
        : organization.footer_description,
      resolvedCopyright !== undefined
        ? resolvedCopyright
        : organization.copyright_text,

      resolvedBranding !== undefined
        ? serializeJsonColumn(
            resolvedBranding,
            null
          )
        : serializeJsonColumn(
            parseJsonColumn(organization.branding, null),
            null
          ),

      resolvedStatsBanner !== undefined
        ? serializeJsonColumn(
            normalizeArray(resolvedStatsBanner),
            []
          )
        : serializeJsonColumn(
            normalizeArray(organization.stats_banner),
            []
          ),

      resolvedSisterOrgs !== undefined
        ? serializeJsonColumn(
            normalizeArray(resolvedSisterOrgs),
            []
          )
        : serializeJsonColumn(
            normalizeArray(
              organization.sister_organizations
            ),
            []
          ),

      resolvedFooterConfig !== undefined
        ? serializeJsonColumn(
            normalizeObject(resolvedFooterConfig),
            null
          )
        : serializeJsonColumn(
            normalizeObject(organization.footer_config),
            null
          ),

      organization.id,
    ];

    await pool.execute(sql, values);

    return res.status(200).json({
      message: "Organization updated successfully",
      slug: newSlug,
      id: organization.id,
    });
  } catch (error) {
    console.error("Update organization error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "An organization with this information already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update organization",
    });
  }
};


// DELETE ORGANIZATION


export const deleteOrganization = async (req, res) => {
  try {
    const { slug } = req.params;

    if (slug === "main-portal" || slug === "0") {
      return res.status(400).json({
        message: "The main portal organization cannot be deleted",
      });
    }

    const isId = /^\d+$/.test(slug);

    const [existing] = await pool.execute(
      isId
        ? `SELECT id, slug FROM organizations WHERE id = ? LIMIT 1`
        : `SELECT id, slug FROM organizations WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const targetId = existing[0].id;

    if (
      Number(targetId) === 0 ||
      existing[0].slug === "main-portal"
    ) {
      return res.status(400).json({
        message: "The main portal organization cannot be deleted",
      });
    }

    await pool.execute(
      `DELETE FROM organizations WHERE id = ?`,
      [targetId]
    );

    return res.status(200).json({
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Delete organization error:", error);

    return res.status(500).json({
      message: "Failed to delete organization",
    });
  }
};