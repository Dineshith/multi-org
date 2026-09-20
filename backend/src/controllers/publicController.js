import db from "../config/db.js";

const getOrganizationHome = async (req, res) => {
    try {
        const { slug } = req.params;

        const [organizations] = await db.query(
            `SELECT id, name, slug, type, description, email, phone,
                    address, map_link, logo_url, website, why_us
             FROM organizations
             WHERE slug = ?
             LIMIT 1`,
            [slug]
        );

        if (organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        const organization = organizations[0];
        const organizationId = organization.id;

        const [banners, notices, faculties, programs, news, leaderMessages, events, services] =
            await Promise.all([
                db.query(
                    `SELECT id, title, banner_text, image_url, link_url, sort_order
                     FROM banners
                     WHERE organization_id = ? AND is_active = TRUE
                     ORDER BY sort_order ASC, id DESC`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, title, description, notice_date, file_url
                     FROM notices
                     WHERE organization_id = ?
                     ORDER BY notice_date DESC, id DESC
                     LIMIT 10`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, name, subtitle, description1, description2, description3
                     FROM faculties
                     WHERE organization_id = ?
                     ORDER BY id ASC`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, faculty_id, name, code, level, duration, description
                     FROM programs
                     WHERE organization_id = ?
                     ORDER BY id ASC`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, category, title, slug, content, image_url, published_date
                     FROM news
                     WHERE organization_id = ?
                     ORDER BY published_date DESC, id DESC
                     LIMIT 8`,
                    [organizationId]
                ),
                db.query(
                    `SELECT lm.id, lm.title, lm.saying, lm.image_url,
                            u.name AS user_name
                     FROM leader_messages lm
                     JOIN users u ON u.id = lm.user_id
                     WHERE lm.organization_id = ?
                     ORDER BY lm.created_at DESC
                     LIMIT 6`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, title, description, event_date, image_url
                     FROM events
                     WHERE organization_id = ?
                     ORDER BY event_date ASC, id ASC
                     LIMIT 8`,
                    [organizationId]
                ),
                db.query(
                    `SELECT id, title, description, icon, sort_order
                     FROM services
                     WHERE organization_id = ?
                     ORDER BY sort_order ASC, id ASC`,
                    [organizationId]
                )
            ]);

        return res.status(200).json({
            success: true,
            data: {
                organization,
                banners: banners[0],
                notices: notices[0],
                faculties: faculties[0],
                programs: programs[0],
                news: news[0],
                leader_messages: leaderMessages[0],
                events: events[0],
                services: services[0]
            }
        });
    } catch (error) {
        console.error("Get organization home error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load organization home page"
        });
    }
};

const getActiveOrganization = async (slug) => {
    const [organizations] = await db.query(
        `SELECT id, name, slug, type, description, email, phone, address,
                map_link, logo_url,
                website, why_us
         FROM organizations
             WHERE slug = ?
         LIMIT 1`,
        [slug]
    );

    return organizations[0] || null;
};

const getOrganizationAbout = async (req, res) => {
    try {
        const organization = await getActiveOrganization(req.params.slug);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const [banners] = await db.query(
            `SELECT id, title, banner_text, image_url, link_url, sort_order
             FROM banners
             WHERE organization_id = ? AND is_active = TRUE
             ORDER BY sort_order ASC, id DESC
             LIMIT 1`,
            [organization.id]
        );

        return res.json({
            success: true,
            data: {
                organization,
                hero: banners[0] || null,
                about: {
                    description: organization.description,
                    image_url: organization.logo_url
                },
                why_us: {
                    items: organization.why_us || [],
                    image_url: organization.logo_url
                }
            }
        });
    } catch (error) {
        console.error("Get organization about error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load organization about page"
        });
    }
};

const getOrganizationGallery = async (req, res) => {
    try {
        const organization = await getActiveOrganization(req.params.slug);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const [galleries] = await db.query(
            `SELECT id, name, description, cover_image_url, created_at
             FROM galleries
             WHERE organization_id = ?
             ORDER BY created_at DESC, id DESC`,
            [organization.id]
        );

        const [images] = await db.query(
            `SELECT gi.id, gi.gallery_id, gi.title, gi.image_url,
                    gi.description, gi.sort_order
             FROM gallery_images gi
             JOIN galleries g ON g.id = gi.gallery_id
             WHERE g.organization_id = ?
             ORDER BY gi.sort_order ASC, gi.id DESC`,
            [organization.id]
        );

        const galleryData = galleries.map((gallery) => ({
            ...gallery,
            images: images.filter((image) => image.gallery_id === gallery.id)
        }));

        return res.json({
            success: true,
            data: {
                organization,
                galleries: galleryData,
                images
            }
        });
    } catch (error) {
        console.error("Get organization gallery error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load organization gallery"
        });
    }
};

const getOrganizationEvents = async (req, res) => {
    try {
        const organization = await getActiveOrganization(req.params.slug);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const [heroRows, events] = await Promise.all([
            db.query(
                `SELECT id, title, banner_text, image_url, link_url, sort_order
                 FROM banners
                 WHERE organization_id = ? AND is_active = TRUE
                 ORDER BY sort_order ASC, id DESC
                 LIMIT 1`,
                [organization.id]
            ),
            db.query(
                `SELECT id, title, description, event_date, image_url
                 FROM events
                 WHERE organization_id = ?
                 ORDER BY event_date ASC, id ASC`,
                [organization.id]
            )
        ]);

        return res.json({
            success: true,
            data: {
                organization,
                hero: heroRows[0][0] || null,
                events: events[0]
            }
        });
    } catch (error) {
        console.error("Get organization events error:", error);
        return res.status(500).json({ success: false, message: "Failed to load events page" });
    }
};

const getOrganizationAcademic = async (req, res) => {
    try {
        const organization = await getActiveOrganization(req.params.slug);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const [heroRows, faculties, programs, subjects, scholarships, fees, criteria] =
            await Promise.all([
                db.query(
                    `SELECT id, title, banner_text, image_url, link_url, sort_order
                     FROM banners
                     WHERE organization_id = ? AND is_active = TRUE
                     ORDER BY sort_order ASC, id DESC
                     LIMIT 1`,
                    [organization.id]
                ),
                db.query(
                    `SELECT id, name, subtitle, description1, description2, description3
                     FROM faculties
                     WHERE organization_id = ?
                     ORDER BY id ASC`,
                    [organization.id]
                ),
                db.query(
                    `SELECT id, faculty_id, name, code, level, duration, description
                     FROM programs
                     WHERE organization_id = ?
                     ORDER BY id ASC`,
                    [organization.id]
                ),
                db.query(
                    `SELECT s.id, s.faculty_id, s.program_id, s.name, s.code, s.class_name
                     FROM subjects s
                     JOIN faculties f ON f.id = s.faculty_id
                     WHERE f.organization_id = ?
                     ORDER BY s.id ASC`,
                    [organization.id]
                ),
                db.query(
                    `SELECT id, program_id, type, title, description, eligibility,
                            amount, deadline, writer, research_year, level,
                            research_type, publication_date, cover_image_url, file_url
                     FROM resources
                     WHERE organization_id = ? AND type = 'SCHOLARSHIP'
                     ORDER BY deadline ASC, id DESC`,
                    [organization.id]
                ),
                db.query(
                    `SELECT id AS program_id, name AS program_name,
                            admission_fee, annual_fee, monthly_fee, other_fee
                     FROM programs
                     WHERE organization_id = ?
                     ORDER BY name ASC`,
                    [organization.id]
                ),
                db.query(
                    `SELECT id AS program_id, name AS program_name, admission_criteria
                     FROM programs
                     WHERE organization_id = ?
                     ORDER BY name ASC`,
                    [organization.id]
                )
            ]);

        return res.json({
            success: true,
            data: {
                organization,
                hero: heroRows[0][0] || null,
                faculties: faculties[0],
                programs: programs[0],
                subjects: subjects[0],
                scholarships: scholarships[0],
                fee_structures: fees[0],
                admission_criteria: criteria[0]
            }
        });
    } catch (error) {
        console.error("Get organization academic error:", error);
        return res.status(500).json({ success: false, message: "Failed to load academic page" });
    }
};

const getOrganizationProgram = async (req, res) => {
    try {
        const organization = await getActiveOrganization(req.params.slug);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const [programs] = await db.query(
            `SELECT p.id, p.faculty_id, p.name, p.code, p.level,
                    p.duration, p.description, p.admission_criteria,
                    f.name AS faculty_name
             FROM programs p
             LEFT JOIN faculties f ON f.id = p.faculty_id
             WHERE p.id = ? AND p.organization_id = ?
             LIMIT 1`,
            [req.params.programId, organization.id]
        );

        if (programs.length === 0) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        const program = programs[0];
        const [subjects, feeStructures, admissionCriteria, relatedPrograms] = await Promise.all([
            db.query(
                `SELECT id, name, code, class_name
                 FROM subjects
                 WHERE program_id = ? AND faculty_id = ?
                 ORDER BY id ASC`,
                [program.id, program.faculty_id]
            ),
            db.query(
                `SELECT id, admission_fee, annual_fee, monthly_fee, other_fee
                 FROM programs
                 WHERE id = ? AND organization_id = ?`,
                [program.id, organization.id]
            ),
            db.query(
                `SELECT id, name, code, level, duration
                 FROM programs
                 WHERE organization_id = ? AND id <> ?
                 ORDER BY name ASC`,
                [organization.id, program.id]
            )
        ]);

        return res.json({
            success: true,
            data: {
                organization,
                program,
                subjects: subjects[0],
                curriculum: {
                    class_xi: subjects[0].filter((subject) => subject.class_name === "XI"),
                    class_xii: subjects[0].filter((subject) => subject.class_name === "XII")
                },
                fee_structures: feeStructures[0],
                admission_criteria: program.admission_criteria || [],
                related_programs: relatedPrograms[0]
            }
        });
    } catch (error) {
        console.error("Get organization program error:", error);
        return res.status(500).json({ success: false, message: "Failed to load course page" });
    }
};

export {
    getOrganizationHome,
    getOrganizationAbout,
    getOrganizationGallery,
    getOrganizationEvents,
    getOrganizationAcademic,
    getOrganizationProgram
};