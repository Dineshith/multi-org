import db from "../../config/db.js";
const getOrgFilter = (req) => {
  const user = req.user;

  if (user.role === "SUPER_ADMIN") {
    const requestedOrg = req.query.organization_id || req.query.orgId;
    if (requestedOrg) {
      return { orgId: Number(requestedOrg), scoped: true, isSuperAdmin: true };
    }
    return { orgId: null, scoped: false, isSuperAdmin: true };
  }

  return { orgId: user.organization_id, scoped: true, isSuperAdmin: false };
};
export const getDashboardData = async (req, res) => {
  try {
    const { orgId, scoped, isSuperAdmin } = getOrgFilter(req);

    // If super admin and no org requested, provide super-admin dashboard view
    if (!scoped && isSuperAdmin) {
      return await getSuperAdminDashboard(req, res);
    }

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required for organization dashboard",
      });
    }

    // 1. Fetch organization details
    const [orgRows] = await db.query(
      `
      SELECT 
        id, name, type, slug, email, phone, logo_url, address, 
        map_link, status, footer_description, copyright_text, created_at
      FROM organizations 
      WHERE id = ? 
      LIMIT 1
      `,
      [orgId]
    );

    if (orgRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const organization = orgRows[0];

    // Notices
    const [noticeStats] = await db.query(
      `
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END), 0) AS published,
        COALESCE(SUM(CASE WHEN published = 0 OR published IS NULL THEN 1 ELSE 0 END), 0) AS draft
      FROM notices 
      WHERE organization_id = ?
      `,
      [orgId]
    );

    // Events
    const [eventStats] = await db.query(
      `
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN event_date >= NOW() THEN 1 ELSE 0 END), 0) AS upcoming,
        COALESCE(SUM(CASE WHEN event_date < NOW() THEN 1 ELSE 0 END), 0) AS past
      FROM events 
      WHERE organization_id = ?
      `,
      [orgId]
    );

    // Staff
    const [staffStats] = await db.query(
      `SELECT COUNT(*) AS total FROM staff WHERE organization_id = ?`,
      [orgId]
    );

    // Pages
    const [pageStats] = await db.query(
      `SELECT COUNT(*) AS total FROM pages WHERE organization_id = ?`,
      [orgId]
    );

    // News
    const [newsStats] = await db.query(
      `
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END), 0) AS published
      FROM news 
      WHERE organization_id = ?
      `,
      [orgId]
    );

    // Students (safe check)
    let totalStudents = 0;
    try {
      const [studentStats] = await db.query(
        `SELECT COUNT(*) AS total FROM students WHERE organization_id = ?`,
        [orgId]
      );
      totalStudents = Number(studentStats[0]?.total) || 0;
    } catch {
      totalStudents = 0;
    }

    // Courses (safe check)
    let totalCourses = 0;
    let distinctDisciplines = 0;
    try {
      const [courseStats] = await db.query(
        `SELECT COUNT(*) AS total, COUNT(DISTINCT discipline) AS distinct_disciplines FROM courses WHERE organization_id = ?`,
        [orgId]
      );
      totalCourses = Number(courseStats[0]?.total) || 0;
      distinctDisciplines = Number(courseStats[0]?.distinct_disciplines) || 0;
    } catch {
      totalCourses = 0;
      distinctDisciplines = 0;
    }

    const totalNotices = Number(noticeStats[0]?.total) || 0;
    const publishedNotices = Number(noticeStats[0]?.published) || 0;
    const draftNotices = Number(noticeStats[0]?.draft) || 0;

    const totalEvents = Number(eventStats[0]?.total) || 0;
    const upcomingEventsCount = Number(eventStats[0]?.upcoming) || 0;
    const pastEventsCount = Number(eventStats[0]?.past) || 0;

    const totalStaff = Number(staffStats[0]?.total) || 0;
    const totalPages = Number(pageStats[0]?.total) || 0;
    const totalNews = Number(newsStats[0]?.total) || 0;

    // 3. Recent Notices (latest 5)
    const [recentNotices] = await db.query(
      `
      SELECT 
        id, organization_id, title, content, published, 
        published_at, publish_on_main_portal, created_at, updated_at
      FROM notices 
      WHERE organization_id = ?
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      LIMIT 5
      `,
      [orgId]
    );

    // 4. Upcoming Events (latest 5 upcoming or recent)
    const [upcomingEvents] = await db.query(
      `
      SELECT 
        id, organization_id, title, description, event_date, 
        publish_on_main_portal, created_at, updated_at
      FROM events 
      WHERE organization_id = ?
      ORDER BY 
        CASE WHEN event_date >= NOW() THEN 0 ELSE 1 END ASC,
        event_date ASC, 
        created_at DESC
      LIMIT 5
      `,
      [orgId]
    );

    // 5. Recent Staff (latest 5)
    const [recentStaff] = await db.query(
      `
      SELECT 
        id, organization_id, name, designation, department, 
        email, phone, photo_url, created_at
      FROM staff 
      WHERE organization_id = ?
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [orgId]
    );

    // 6. Recent Pages (latest 5)
    const [recentPages] = await db.query(
      `
      SELECT id, organization_id, title, slug, created_at, updated_at
      FROM pages 
      WHERE organization_id = ?
      ORDER BY updated_at DESC
      LIMIT 5
      `,
      [orgId]
    );

    // 7. Combined Activity Stream
    const activities = [
      ...recentNotices.map((n) => ({
        id: `notice-${n.id}`,
        type: "notice",
        title: n.title,
        status: n.published ? "published" : "draft",
        timestamp: n.published_at || n.created_at,
        link: `/admin/dashboard/notices`,
      })),
      ...upcomingEvents.map((e) => ({
        id: `event-${e.id}`,
        type: "event",
        title: e.title,
        status: new Date(e.event_date) >= new Date() ? "upcoming" : "past",
        timestamp: e.event_date || e.created_at,
        link: `/admin/dashboard/events`,
      })),
      ...recentStaff.map((s) => ({
        id: `staff-${s.id}`,
        type: "staff",
        title: `${s.name} (${s.designation || "Staff"})`,
        status: "active",
        timestamp: s.created_at,
        link: `/admin/dashboard/staff`,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    // 8. Stat Cards (formatted for OrgAdmin Dashboard cards)
    const statCards = [
      {
        id: "notices",
        title: "Total Notices",
        value: totalNotices,
        published: publishedNotices,
        draft: draftNotices,
        icon: "FileText",
        color: "indigo",
        link: "/admin/dashboard/notices",
      },
      {
        id: "events",
        title: "Upcoming Events",
        value: upcomingEventsCount,
        total: totalEvents,
        past: pastEventsCount,
        icon: "Calendar",
        color: "green",
        link: "/admin/dashboard/events",
      },
      {
        id: "staff",
        title: "Staff Members",
        value: totalStaff,
        icon: "Users",
        color: "orange",
        link: "/admin/dashboard/staff",
      },
      {
        id: "pages",
        title: "Total Pages",
        value: totalPages,
        icon: "LayoutTemplate",
        color: "blue",
        link: "/admin/dashboard/pages",
      },
    ];

    return res.status(200).json({
      success: true,
      message: "Organization dashboard data retrieved successfully",
      data: {
        organization,
        counts: {
          notices: totalNotices,
          publishedNotices,
          draftNotices,
          events: totalEvents,
          upcomingEvents: upcomingEventsCount,
          pastEvents: pastEventsCount,
          staff: totalStaff,
          pages: totalPages,
          news: totalNews,
          students: totalStudents,
          courses: totalCourses,
          disciplines: distinctDisciplines,
        },
        statCards,
        recentNotices,
        upcomingEvents,
        recentStaff,
        recentPages,
        recentActivities: activities,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

const getSuperAdminDashboard = async (req, res) => {
  try {
    // Organizations stats
    const [orgStats] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END), 0) AS active,
        COALESCE(SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END), 0) AS inactive
      FROM organizations
    `);

    // Users stats
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN role = 'SUPER_ADMIN' THEN 1 ELSE 0 END), 0) AS superAdmins,
        COALESCE(SUM(CASE WHEN role = 'ORG_ADMIN' THEN 1 ELSE 0 END), 0) AS orgAdmins
      FROM users
    `);

    // Global counts
    const [noticeStats] = await db.query(`SELECT COUNT(*) AS total FROM notices`);
    const [eventStats] = await db.query(`SELECT COUNT(*) AS total FROM events`);
    const [staffStats] = await db.query(`SELECT COUNT(*) AS total FROM staff`);
    const [pageStats] = await db.query(`SELECT COUNT(*) AS total FROM pages`);

    // Recent organizations
    const [recentOrgs] = await db.query(`
      SELECT id, name, type, slug, email, phone, logo_url, status, created_at
      FROM organizations
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const statCards = [
      {
        id: "active_organizations",
        title: "Active Organizations",
        value: Number(orgStats[0]?.active) || 0,
        total: Number(orgStats[0]?.total) || 0,
        icon: "Building2",
        color: "blue",
        link: "/platform-admin/organizations",
      },
      {
        id: "org_admins",
        title: "Organization Admins",
        value: Number(userStats[0]?.orgAdmins) || 0,
        total: Number(userStats[0]?.total) || 0,
        icon: "Activity",
        color: "green",
        link: "/platform-admin/settings",
      },
      {
        id: "total_staff",
        title: "Total Staff Members",
        value: Number(staffStats[0]?.total) || 0,
        icon: "Users",
        color: "orange",
      },
      {
        id: "total_pages",
        title: "Total Pages",
        value: Number(pageStats[0]?.total) || 0,
        icon: "FileText",
        color: "indigo",
      },
    ];

    return res.status(200).json({
      success: true,
      message: "Super admin dashboard data retrieved successfully",
      data: {
        isSuperAdmin: true,
        counts: {
          organizations: Number(orgStats[0]?.total) || 0,
          activeOrganizations: Number(orgStats[0]?.active) || 0,
          inactiveOrganizations: Number(orgStats[0]?.inactive) || 0,
          users: Number(userStats[0]?.total) || 0,
          orgAdmins: Number(userStats[0]?.orgAdmins) || 0,
          superAdmins: Number(userStats[0]?.superAdmins) || 0,
          notices: Number(noticeStats[0]?.total) || 0,
          events: Number(eventStats[0]?.total) || 0,
          staff: Number(staffStats[0]?.total) || 0,
          pages: Number(pageStats[0]?.total) || 0,
        },
        statCards,
        recentOrganizations: recentOrgs,
      },
    });
  } catch (error) {
    console.error("Super Admin Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch super admin dashboard data",
      error: error.message,
    });
  }
};


//  Quick summary of cards and key numbers.
export const getDashboardStats = async (req, res) => {
  try {
    const { orgId, scoped, isSuperAdmin } = getOrgFilter(req);

    if (!scoped && isSuperAdmin) {
      const [orgStats] = await db.query(`SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END), 0) AS active FROM organizations`);
      const [userStats] = await db.query(`SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN role = 'ORG_ADMIN' THEN 1 ELSE 0 END), 0) AS orgAdmins FROM users`);

      return res.status(200).json({
        success: true,
        data: {
          activeOrganizations: Number(orgStats[0]?.active) || 0,
          totalOrganizations: Number(orgStats[0]?.total) || 0,
          orgAdmins: Number(userStats[0]?.orgAdmins) || 0,
        },
      });
    }

    if (!orgId) {
      return res.status(400).json({ success: false, message: "Organization ID is required" });
    }

    const [notices] = await db.query(`SELECT COUNT(*) AS total FROM notices WHERE organization_id = ?`, [orgId]);
    const [events] = await db.query(`SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN event_date >= NOW() THEN 1 ELSE 0 END), 0) AS upcoming FROM events WHERE organization_id = ?`, [orgId]);
    const [staff] = await db.query(`SELECT COUNT(*) AS total FROM staff WHERE organization_id = ?`, [orgId]);
    const [pages] = await db.query(`SELECT COUNT(*) AS total FROM pages WHERE organization_id = ?`, [orgId]);

    return res.status(200).json({
      success: true,
      data: {
        totalNotices: Number(notices[0]?.total) || 0,
        upcomingEvents: Number(events[0]?.upcoming) || 0,
        totalEvents: Number(events[0]?.total) || 0,
        totalStaff: Number(staff[0]?.total) || 0,
        totalPages: Number(pages[0]?.total) || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};
// Returns latest notices scoped to the organization for the dashboard widget.
export const getDashboardNotices = async (req, res) => {
  try {
    const { orgId } = getOrgFilter(req);
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    let query = `SELECT * FROM notices `;
    let params = [];

    if (orgId) {
      query += `WHERE organization_id = ? `;
      params.push(orgId);
    }

    query += `ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?`;
    params.push(limit);

    const [notices] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error("Dashboard notices error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notices", error: error.message });
  }
};
export const getDashboardEvents = async (req, res) => {
  try {
    const { orgId } = getOrgFilter(req);
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    let query = `SELECT * FROM events `;
    let params = [];

    if (orgId) {
      query += `WHERE organization_id = ? `;
      params.push(orgId);
    }

    query += `ORDER BY CASE WHEN event_date >= NOW() THEN 0 ELSE 1 END ASC, event_date ASC, created_at DESC LIMIT ?`;
    params.push(limit);

    const [events] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Dashboard events error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch events", error: error.message });
  }
};
