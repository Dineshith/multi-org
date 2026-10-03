import db from "../config/db.js";
const getActiveOrgBySlug = async (slug) => {
  const [rows] = await db.query(
    `SELECT id, name, type, slug, email, phone, logo_url, address, map_link,
            footer_description, copyright_text
     FROM organizations
     WHERE slug = ? AND status = 'ACTIVE'
     LIMIT 1`,
    [slug],
  );
  return rows.length > 0 ? rows[0] : null;
};

const shapeOrganization = (org) => ({
  id: org.id,
  name: org.name,
  type: org.type,
  slug: org.slug,
  email: org.email,
  phone: org.phone,
  address: org.address,
  branding: {
    logo: org.logo_url,
    primaryColor: "#4f46e5",
    secondaryColor: "#f8fafc",
  },
  footer: {
    logo: org.logo_url,
    description: org.footer_description || "",
    facultyTitle: "Faculty",
    facultyDetails: "",
    contactTitle: "Contact Us",
    contactInfo: [org.email, org.phone].filter(Boolean).join("\n"),
    mapUrl: org.map_link || "",
    copyrightText: org.copyright_text || "",
  },
  statsBanner: [],
  sisterOrganizations: [],
});

const parseJson = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getPublicOrganization = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await getActiveOrgBySlug(slug);

    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    res
      .status(200)
      .json({ success: true, organization: shapeOrganization(org) });
  } catch (error) {
    console.error("Get public organization error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch organization" });
  }
};


const getPublicPages = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await getActiveOrgBySlug(slug);

    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const [pages] = await db.query(
      `SELECT id, title, slug
       FROM pages
       WHERE organization_id = ?
       ORDER BY created_at ASC`,
      [org.id],
    );

    res.status(200).json({ success: true, pages });
  } catch (error) {
    console.error("Get public pages error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch pages" });
  }
};

const getPublicPageBySlug = async (req, res) => {
  try {
    const { slug, pageSlug } = req.params;
    const org = await getActiveOrgBySlug(slug);

    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const [pages] = await db.query(
      `SELECT id, title, slug, sections
       FROM pages
       WHERE organization_id = ? AND slug = ?
       LIMIT 1`,
      [org.id, pageSlug],
    );

    if (pages.length === 0) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const page = pages[0];

    res.status(200).json({
      success: true,
      page: {
        id: page.id,
        organizationId: org.id,
        title: page.title,
        slug: page.slug,
        sections: parseJson(page.sections) || [],
      },
    });
  } catch (error) {
    console.error("Get public page error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch page" });
  }
};

const getPublicNotices = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await getActiveOrgBySlug(slug);

    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const [notices] = await db.query(
      `SELECT id, organization_id, title, content, published_at
       FROM notices
       WHERE organization_id = ?
         AND published = TRUE
         AND published_at IS NOT NULL
       ORDER BY published_at DESC`,
      [org.id],
    );

    res.status(200).json({
      success: true,
      notices: notices.map((notice) => ({
        id: notice.id,
        organizationId: notice.organization_id,
        title: notice.title,
        content: notice.content,
        publishedAt: notice.published_at,
      })),
    });
  } catch (error) {
    console.error("Get public notices error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notices" });
  }
};

const getPublicEvents = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await getActiveOrgBySlug(slug);

    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const [events] = await db.query(
      `SELECT id, organization_id, title, description, event_date
       FROM events
       WHERE organization_id = ?
       ORDER BY event_date ASC`,
      [org.id],
    );

    res.status(200).json({
      success: true,
      events: events.map((event) => ({
        id: event.id,
        organizationId: event.organization_id,
        title: event.title,
        description: event.description,
        date: event.event_date,
      })),
    });
  } catch (error) {
    console.error("Get public events error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch events" });
  }
};

export {
  getPublicOrganization,
  getPublicPages,
  getPublicPageBySlug,
  getPublicNotices,
  getPublicEvents,
};