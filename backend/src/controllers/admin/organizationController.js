import pool from "../../config/db.js";
import generateSlug from "../../utils/generateSlug.js";

// --- helpers -------------------------------------------------------------
// JSON columns come back from mysql2 as parsed objects, but a hand-inserted
// row (or a MySQL build that keeps them as strings) can still yield text.
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

// Keeps the frontend's nested branding/footer/stats objects in one place.
const shapeOrganization = (row) => {
  const branding = parseJsonColumn(row.branding, null);
  const footerConfig = parseJsonColumn(row.footer_config, null);

  return {
    ...row,
    branding: {
      logo: row.logo_url || "",
      primaryColor: branding?.primaryColor || "#4f46e5",
      secondaryColor: branding?.secondaryColor || "#f3f4f6",
    },
    statsBanner: parseJsonColumn(row.stats_banner, []) || [],
    sisterOrganizations: parseJsonColumn(row.sister_organizations, []) || [],
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

// Accepted keys of the `branding` object. `logo` is accepted for convenience
// but the canonical column is organizations.logo_url.
const BRANDING_FIELDS = ["primaryColor", "secondaryColor", "logo"];// A brand new organization would otherwise have no public site at all, so
// create the same starter pages the previous localStorage flow generated.
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
      ]
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
            footer_config
        } = req.body;

        // Required fields
        if (!name || !type || !email) {
            return res.status(400).json({
                message: "Name, type and email are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        // Nepal phone validation
        if (phone) {
            const phoneRegex = /^(?:\+977|977)?9[6-8]\d{8}$/;

            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: "Invalid Nepal phone number"
                });
            }
        }

        // Status validation
        if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                message: "Status must be ACTIVE or INACTIVE"
            });
        }

        // Validate branding object
        if (
            branding &&
            typeof branding === "object" &&
            Object.keys(branding).some((key) => !BRANDING_FIELDS.includes(key))
        ) {
            return res.status(400).json({
                message: `Invalid branding fields. Allowed: ${BRANDING_FIELDS.join(", ")}`
            });
        }

        // Generate unique slug
        const slug = await generateSlug(name, pool);

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
            phone || null,
            logo_url || null,
            address || null,
            map_link || null,
            status || "ACTIVE",
            footer_description || null,
            copyright_text || null,
            serializeJsonColumn(branding, null),
            serializeJsonColumn(stats_banner, []),
            serializeJsonColumn(sister_organizations, []),
            serializeJsonColumn(footer_config, null)
        ];

        const [result] = await pool.execute(sql, values);

        // Give the new tenant a usable starting site instead of a blank one.
        await seedStarterPages(result.insertId, name, type);

        return res.status(201).json({
            message: "Organization created successfully",
            organizationId: result.insertId,
            slug
        });

    } catch (error) {
        console.error("Create organization error:", error);

        return res.status(500).json({
            message: "Failed to create organization"
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
            data: rows.map(shapeOrganization)
        });

    } catch (error) {
        console.error("Get all organizations error:", error);

        return res.status(500).json({
            message: "Failed to fetch organizations"
        });
    }
};
// GET ORGANIZATION BY SLUG
export const getOrganizationBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [rows] = await pool.execute(
            `
                SELECT *
                FROM organizations
                WHERE slug = ?
                LIMIT 1
            `,
            [slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        return res.status(200).json({
            message: "Organization fetched successfully",
            data: shapeOrganization(rows[0])
        });

    } catch (error) {
        console.error("Get organization by slug error:", error);

        return res.status(500).json({
            message: "Failed to fetch organization"
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
            footer_config
        } = req.body;

        // Validate branding object
        if (
            branding &&
            typeof branding === "object" &&
            Object.keys(branding).some((key) => !BRANDING_FIELDS.includes(key))
        ) {
            return res.status(400).json({
                message: `Invalid branding fields. Allowed: ${BRANDING_FIELDS.join(", ")}`
            });
        }

        // Check organization exists
        const [existing] = await pool.execute(
            `
                SELECT *
                FROM organizations
                WHERE slug = ?
                LIMIT 1
            `,
            [slug]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        const organization = existing[0];

        // ORG_ADMIN may only edit their own organization
        if (
            req.user.role !== "SUPER_ADMIN" &&
            organization.id !== req.user.organization_id
        ) {
            return res.status(403).json({
                message: "You can only update your own organization"
            });
        }

        // Email validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid email address"
                });
            }
        }

        // Nepal phone validation
        if (phone) {
            const phoneRegex = /^(?:\+977|977)?9[6-8]\d{8}$/;

            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: "Invalid Nepal phone number"
                });
            }
        }

        // Status validation
        if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                message: "Status must be ACTIVE or INACTIVE"
            });
        }

        // Generate new slug if name changes
        let newSlug = organization.slug;

        if (name && name !== organization.name) {
            newSlug = await generateSlug(name, pool);
        }

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
            WHERE slug = ?
        `;

        const values = [
            name ?? organization.name,
            type ?? organization.type,
            newSlug,
            email ?? organization.email,
            phone ?? organization.phone,
            logo_url ?? organization.logo_url,
            address ?? organization.address,
            map_link ?? organization.map_link,
            status ?? organization.status,
            footer_description ?? organization.footer_description,
            copyright_text ?? organization.copyright_text,
            branding !== undefined
                ? serializeJsonColumn(branding, null)
                : serializeJsonColumn(parseJsonColumn(organization.branding, null), null),
            stats_banner !== undefined
                ? serializeJsonColumn(stats_banner, [])
                : serializeJsonColumn(parseJsonColumn(organization.stats_banner, []), []),
            sister_organizations !== undefined
                ? serializeJsonColumn(sister_organizations, [])
                : serializeJsonColumn(parseJsonColumn(organization.sister_organizations, []), []),
            footer_config !== undefined
                ? serializeJsonColumn(footer_config, null)
                : serializeJsonColumn(parseJsonColumn(organization.footer_config, null), null),
            slug
        ];

        await pool.execute(sql, values);

        return res.status(200).json({
            message: "Organization updated successfully",
            slug: newSlug
        });

    } catch (error) {
        console.error("Update organization error:", error);

        return res.status(500).json({
            message: "Failed to update organization"
        });
    }
};
// DELETE ORGANIZATION
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
            [slug]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        await pool.execute(
            `
                DELETE FROM organizations
                WHERE slug = ?
            `,
            [slug]
        );

        return res.status(200).json({
            message: "Organization deleted successfully"
        });

    } catch (error) {
        console.error("Delete organization error:", error);

        return res.status(500).json({
            message: "Failed to delete organization"
        });
    }
};