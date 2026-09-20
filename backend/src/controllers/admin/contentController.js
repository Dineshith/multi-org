import db from "../../config/db.js";

const resources = {
    banners: {
        table: "banners",
        fields: ["title", "banner_text", "image_url", "link_url", "sort_order", "is_active"],
        required: []
    },
    notices: {
        table: "notices",
        fields: ["title", "description", "notice_date", "file_url"],
        required: ["title", "description", "notice_date"]
    },
    events: {
        table: "events",
        fields: ["title", "description", "event_date", "image_url"],
        required: ["title", "event_date"]
    },
    services: {
        table: "services",
        fields: ["title", "description", "icon", "sort_order"],
        required: ["title"]
    },
    faculties: {
        table: "faculties",
        fields: ["name", "subtitle", "description1", "description2", "description3"],
        required: ["name"]
    },
    programs: {
        table: "programs",
        fields: ["faculty_id", "name", "code", "level", "duration", "description"],
        required: ["name"]
    },
    news: {
        table: "news",
        fields: ["category", "title", "content", "image_url", "published_date"],
        required: ["title"]
    },
    scholarships: {
        table: "resources",
        fields: ["program_id", "title", "description", "eligibility", "amount", "deadline"],
        where: "type = 'SCHOLARSHIP'",
        required: ["title"]
    },
    leader_messages: {
        table: "leader_messages",
        fields: ["title", "saying", "image_url"],
        required: ["saying"]
    }
};

const getResource = (name, res) => {
    const resource = resources[name];

    if (!resource) {
        res.status(404).json({
            success: false,
            message: "Unsupported content resource"
        });
        return null;
    }

    return resource;
};

const getOrganizationId = (req, res) => {
    if (req.user.role === "CONTENT_ADMIN") {
        return req.user.organization_id;
    }

    const organizationId = req.body.organization_id || req.query.organization_id;

    if (!organizationId) {
        res.status(400).json({
            success: false,
            message: "organization_id is required for ADMIN requests"
        });
        return null;
    }

    return organizationId;
};

const buildPayload = (resource, body) => {
    const payload = {};

    for (const field of resource.fields) {
        if (body[field] !== undefined) {
            payload[field] = body[field];
        }
    }

    return payload;
};

const makeSlug = (value) => String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getAllContent = async (req, res) => {
    try {
        const resource = getResource(req.params.resource, res);
        if (!resource) return;

        const organizationId = getOrganizationId(req, res);
        if (!organizationId) return;

        const [rows] = await db.query(
            `SELECT * FROM ${resource.table}
             WHERE organization_id = ?${resource.where ? ` AND ${resource.where}` : ""}
             ORDER BY id DESC`,
            [organizationId]
        );

        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Get content error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch content" });
    }
};

const createContent = async (req, res) => {
    try {
        const resource = getResource(req.params.resource, res);
        if (!resource) return;

        const organizationId = getOrganizationId(req, res);
        if (!organizationId) return;

        const payload = buildPayload(resource, req.body);
        const missingField = resource.required.find((field) => !payload[field]);

        if (missingField) {
            return res.status(400).json({
                success: false,
                message: `${missingField} is required`
            });
        }

        if (req.params.resource === "news") {
            let slug = makeSlug(payload.title);
            const [existing] = await db.query(
                "SELECT id FROM news WHERE organization_id = ? AND slug = ?",
                [organizationId, slug]
            );

            if (existing.length > 0) {
                slug = `${slug}-${Date.now()}`;
            }

            payload.slug = slug;
            payload.created_by = req.user.id;
        }

        if (req.params.resource === "notices" || req.params.resource === "events") {
            payload.created_by = req.user.id;
        }

        if (req.params.resource === "leader_messages") {
            payload.user_id = req.user.id;
        }

        if (req.params.resource === "scholarships") {
            payload.type = "SCHOLARSHIP";
        }

        const fields = Object.keys(payload);
        const columns = ["organization_id", ...fields];
        const values = [organizationId, ...fields.map((field) => payload[field] ?? null)];
        const placeholders = columns.map(() => "?").join(", ");

        const [result] = await db.query(
            `INSERT INTO ${resource.table} (${columns.join(", ")})
             VALUES (${placeholders})`,
            values
        );

        return res.status(201).json({
            success: true,
            message: "Content created successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error("Create content error:", error);
        return res.status(500).json({ success: false, message: "Failed to create content" });
    }
};

const updateContent = async (req, res) => {
    try {
        const resource = getResource(req.params.resource, res);
        if (!resource) return;

        const organizationId = getOrganizationId(req, res);
        if (!organizationId) return;

        const payload = buildPayload(resource, req.body);
        const fields = Object.keys(payload);

        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const [result] = await db.query(
            `UPDATE ${resource.table}
             SET ${fields.map((field) => `${field} = ?`).join(", ")}
             WHERE id = ? AND organization_id = ?${resource.where ? ` AND ${resource.where}` : ""}`,
            [...fields.map((field) => payload[field] ?? null), req.params.id, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        return res.json({ success: true, message: "Content updated successfully" });
    } catch (error) {
        console.error("Update content error:", error);
        return res.status(500).json({ success: false, message: "Failed to update content" });
    }
};

const deleteContent = async (req, res) => {
    try {
        const resource = getResource(req.params.resource, res);
        if (!resource) return;

        const organizationId = getOrganizationId(req, res);
        if (!organizationId) return;

        const [result] = await db.query(
            `DELETE FROM ${resource.table}
             WHERE id = ? AND organization_id = ?${resource.where ? ` AND ${resource.where}` : ""}`,
            [req.params.id, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        return res.json({ success: true, message: "Content deleted successfully" });
    } catch (error) {
        console.error("Delete content error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete content" });
    }
};

export { getAllContent, createContent, updateContent, deleteContent };