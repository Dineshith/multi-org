import pool from "../../config/db.js";
import generateSlug from "../../utils/generateSlug.js";

// JSON columns may arrive as raw strings, so parse defensively.
const parseJsonColumn = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const serializeJsonColumn = (value, fallback) =>
  JSON.stringify(value ?? fallback);

// Shapes branding/footer/stats for the frontend.
const shapeOrganization = (row, allOrgs = []) => {
  const branding = parseJsonColumn(row.branding, null);
  const footerConfig = parseJsonColumn(row.footer_config, null);
  let sisterOrgs = parseJsonColumn(row.sister_organizations, []) || [];

  if (row.slug === "main-portal" && sisterOrgs.length === 0 && allOrgs.length > 0) {
    sisterOrgs = allOrgs
      .filter((o) => o.slug !== "main-portal" && (o.status || "ACTIVE").toUpperCase() === "ACTIVE")
      .map((o) => ({
        name: o.name,
        link: `/org/${o.slug}`,
      }));
  }

  return {
    ...row,
    branding: {
      logo: row.logo_url || "",
      primaryColor: branding?.primaryColor || "#4f46e5",
      secondaryColor: branding?.secondaryColor || "#f3f4f6",
    },
    statsBanner: parseJsonColumn(row.stats_banner, []) || [],
    sisterOrganizations: sisterOrgs,
    footer: {
      logo: row.logo_url || "",
      description: row.footer_description || "",
      facultyTitle: footerConfig?.facultyTitle || "Faculty",
      facultyDetails: footerConfig?.facultyDetails || "",
      contactTitle: footerConfig?.contactTitle || "Contact Us",
      contactInfo: footerConfig?.contactInfo || "",
      mapUrl: row.map_link || "",
      copyrightText: row.copyright_text || "",
    },
  };
};

// Accepted keys of the `branding` object (`logo` maps to organizations.logo_url).
const BRANDING_FIELDS = ["primaryColor", "secondaryColor", "logo"];

const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp";

const buildStarterPages = (name, type) => {
  const isCollege = type === "college" || type === "bachelors";

  return [
    {
      slug: "home",
      sections: [
        {
          id: 1,
          type: "hero",
          background: "default",
          data: {
            title: `Welcome to ${name}`,
            subtitle: "A place for excellence and growth.",
            image: "https://placehold.co/1200x600/374151/ffffff?text=Welcome",
          },
        },
        {
          id: 2,
          type: "combined_events_notices",
          background: "gray",
          data: {
            title: "Upcoming events & Recent Notices",
            subtitle: "Notice Boards",
          },
        },
      ],
    },
    {
      slug: "notices",
      sections: [
        {
          id: 3,
          type: "hero",
          background: "primary",
          data: {
            title: "Official Notices",
            subtitle: "Stay updated with our latest announcements.",
            image: "https://placehold.co/1200x400/4f46e5/ffffff?text=Notices",
          },
        },
        {
          id: 4,
          type: "notice_list",
          background: "gray",
          data: { title: "Recent Announcements" },
        },
      ],
    },
    {
      slug: "contact",
      sections: [
        {
          id: 5,
          type: "contact_form",
          background: "default",
          data: {
            title: "CONTACT US",
            subtitle: "",
            email: "admin@organization.com",
            contactInfo:
              "<p><strong>ADDRESS:</strong><br/>123 Education Lane, City, Country</p>" +
              "<p><strong>PHONE:</strong><br/>+1 234 567 8900</p>" +
              "<p><strong>EMAIL:</strong><br/>info@school.edu</p>" +
              "<p><strong>SCHOOL HOURS:</strong><br/>Mon-Fri: 8:00 AM - 4:00 PM</p>",
            mapUrl: DEFAULT_MAP_URL,
          },
        },
      ],
    },
    {
      slug: "events",
      sections: [
        {
          id: 6,
          type: "text",
          background: "default",
          data: {
            title: "Upcoming Events",
            content: "Join us at our upcoming academic and cultural events.",
          },
        },
        {
          id: 7,
          type: "event_list",
          background: "default",
          data: { title: "" },
        },
      ],
    },
    {
      slug: "about",
      sections: [
        {
          id: 8,
          type: "text",
          background: "default",
          data: {
            title: `About ${name}`,
            content: isCollege
              ? "Empowering higher education and excellence."
              : "Nurturing young minds for a brighter tomorrow.",
          },
        },
      ],
    },
  ];
};

const seedStarterPages = async (organizationId, name, type) => {
  const pages = buildStarterPages(name, type);

  for (const page of pages) {
    await pool.execute(
      `INSERT INTO pages (organization_id, title, slug, sections, dropdown_items)
       VALUES (?, ?, ?, ?, ?)`,
      [
        organizationId,
        page.slug.charAt(0).toUpperCase() + page.slug.slice(1),
        page.slug,
        JSON.stringify(page.sections),
        JSON.stringify([]),
      ],
    );
  }
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

    if (!name || !type || !email) {
      return res.status(400).json({
        message: "Name, type and email are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // Flexible phone validation if provided (allows Nepali mobiles, landlines, spaces, dashes)
    if (phone && String(phone).trim() !== "") {
      const trimmedPhone = String(phone).trim();
      const phoneRegex = /^[+]?[\d\s\-().]{6,25}$/;

      if (!phoneRegex.test(trimmedPhone)) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }
    }

    const normalizedStatus = status ? status.toUpperCase() : "ACTIVE";
    if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    const resolvedBranding = branding && typeof branding === "object" ? branding : null;
    const resolvedStatsBanner = stats_banner ?? statsBanner ?? [];
    const resolvedSisterOrgs = sister_organizations ?? sisterOrganizations ?? [];
    const resolvedFooterConfig = footer_config ?? (footer ? {
      facultyTitle: footer.facultyTitle || "Faculty",
      facultyDetails: footer.facultyDetails || "",
      contactTitle: footer.contactTitle || "Contact Us",
      contactInfo: footer.contactInfo || "",
    } : null);
    const resolvedFooterDesc = footer_description || footer?.description || null;
    const resolvedCopyright = copyright_text || footer?.copyrightText || null;
    const resolvedMapLink = map_link || footer?.mapUrl || null;
    const resolvedLogoUrl = logo_url || branding?.logo || footer?.logo || null;

    const baseSlug = (customSlug && typeof customSlug === "string" && customSlug.trim())
      ? customSlug.trim()
      : name;
    const slug = await generateSlug(baseSlug, pool);

    const sql = `
            INSERT INTO organizations
            (
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
      name,
      type,
      slug,
      email,
      phone && String(phone).trim() ? String(phone).trim() : null,
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

    // Seed starter pages so the tenant site isn't empty.
    await seedStarterPages(result.insertId, name, type);

    return res.status(201).json({
      message: "Organization created successfully",
      organizationId: result.insertId,
      id: result.insertId,
      slug,
      data: {
        id: result.insertId,
        name,
        slug,
        type,
        email,
      },
    });
  } catch (error) {
    console.error("Create organization error:", error);

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
      `
        SELECT *
        FROM organizations
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    let allActiveOrgs = [];
    if (rows[0].slug === "main-portal" || String(rows[0].id) === "0") {
      const [activeRows] = await pool.execute(
        "SELECT id, name, slug, status FROM organizations WHERE slug != 'main-portal' AND status = 'ACTIVE' ORDER BY name ASC"
      );
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

// GET ORGANIZATION BY SLUG (OR ID)
export const getOrganizationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isId = /^\d+$/.test(slug);

    const [rows] = await pool.execute(
      isId
        ? `SELECT * FROM organizations WHERE id = ? LIMIT 1`
        : `SELECT * FROM organizations WHERE slug = ? LIMIT 1`,
      [slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    let allActiveOrgs = [];
    if (rows[0].slug === "main-portal" || String(rows[0].id) === "0") {
      const [activeRows] = await pool.execute(
        "SELECT id, name, slug, status FROM organizations WHERE slug != 'main-portal' AND status = 'ACTIVE' ORDER BY name ASC"
      );
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
      [slug],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const organization = existing[0];

    // ORG_ADMIN may only edit their own organization
    if (
      req.user.role !== "SUPER_ADMIN" &&
      Number(organization.id) !== Number(req.user.organization_id)
    ) {
      return res.status(403).json({
        message: "You can only update your own organization",
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

    if (phone && String(phone).trim() !== "") {
      const phoneRegex = /^[+]?[\d\s\-().]{6,25}$/;

      if (!phoneRegex.test(String(phone).trim())) {
        return res.status(400).json({
          message: "Invalid phone number format",
        });
      }
    }

    const normalizedStatus = status ? status.toUpperCase() : undefined;
    if (normalizedStatus && !["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    // Regenerate slug when updatedSlug or name changes (and not main-portal).
    let newSlug = organization.slug;
    if (updatedSlug && updatedSlug !== organization.slug) {
      newSlug = await generateSlug(updatedSlug, pool);
    } else if (name && name !== organization.name && organization.slug !== "main-portal") {
      newSlug = await generateSlug(name, pool);
    }

    const resolvedStatsBanner =
      stats_banner !== undefined
        ? stats_banner
        : statsBanner !== undefined
        ? statsBanner
        : undefined;

    const resolvedSisterOrgs =
      sister_organizations !== undefined
        ? sister_organizations
        : sisterOrganizations !== undefined
        ? sisterOrganizations
        : undefined;

    const resolvedFooterConfig =
      footer_config !== undefined
        ? footer_config
        : footer
        ? {
            facultyTitle: footer.facultyTitle || "Faculty",
            facultyDetails: footer.facultyDetails || "",
            contactTitle: footer.contactTitle || "Contact Us",
            contactInfo: footer.contactInfo || "",
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
      email ?? organization.email,
      phone !== undefined ? (phone && String(phone).trim() ? String(phone).trim() : null) : organization.phone,
      resolvedLogoUrl !== undefined ? resolvedLogoUrl : organization.logo_url,
      address ?? organization.address,
      resolvedMapLink !== undefined ? resolvedMapLink : organization.map_link,
      normalizedStatus ?? organization.status,
      resolvedFooterDesc !== undefined ? resolvedFooterDesc : organization.footer_description,
      resolvedCopyright !== undefined ? resolvedCopyright : organization.copyright_text,
      branding !== undefined
        ? serializeJsonColumn(branding, null)
        : serializeJsonColumn(
            parseJsonColumn(organization.branding, null),
            null,
          ),
      resolvedStatsBanner !== undefined
        ? serializeJsonColumn(resolvedStatsBanner, [])
        : serializeJsonColumn(
            parseJsonColumn(organization.stats_banner, []),
            [],
          ),
      resolvedSisterOrgs !== undefined
        ? serializeJsonColumn(resolvedSisterOrgs, [])
        : serializeJsonColumn(
            parseJsonColumn(organization.sister_organizations, []),
            [],
          ),
      resolvedFooterConfig !== undefined
        ? serializeJsonColumn(resolvedFooterConfig, null)
        : serializeJsonColumn(
            parseJsonColumn(organization.footer_config, null),
            null,
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

    return res.status(500).json({
      message: "Failed to update organization",
    });
  }
};
// DELETE ORGANIZATION
export const deleteOrganization = async (req, res) => {
  try {
    const { slug } = req.params;

    if (slug === 'main-portal' || slug === '0') {
      return res.status(400).json({
        message: 'The main portal organization cannot be deleted',
      });
    }

    const isId = /^\d+$/.test(slug);
    const [existing] = await pool.execute(
      isId
        ? 'SELECT id, slug FROM organizations WHERE id = ? LIMIT 1'
        : 'SELECT id, slug FROM organizations WHERE slug = ? LIMIT 1',
      [slug],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Organization not found',
      });
    }

    const targetId = existing[0].id;
    if (Number(targetId) === 0) {
      return res.status(400).json({
        message: 'The main portal organization cannot be deleted',
      });
    }

    await pool.execute('DELETE FROM organizations WHERE id = ?', [targetId]);

    return res.status(200).json({
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Delete organization error:', error);

    return res.status(500).json({
      message: 'Failed to delete organization',
    });
  }
};
