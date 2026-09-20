import db from "../../config/db.js";

const getOrganizationId = (req) => {
    if (req.user.role === "CONTENT_ADMIN") {
        return req.user.organization_id;
    }

    return req.body.organization_id || req.query.organization_id;
};

const updateOrganizationProfile = async (req, res) => {
    try {
        const organizationId = getOrganizationId(req);

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "organization_id is required for ADMIN requests"
            });
        }

        const allowedFields = [
            "description", "email", "phone", "address", "map_link", "logo_url",
            "website", "why_us"
        ];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = field === "why_us" && typeof req.body[field] !== "string"
                    ? JSON.stringify(req.body[field])
                    : req.body[field];
            }
        }

        const fields = Object.keys(updates);

        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const [result] = await db.query(
            `UPDATE organizations
             SET ${fields.map((field) => `${field} = ?`).join(", ")}
             WHERE id = ?`,
            [...fields.map((field) => updates[field]), organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        return res.json({ success: true, message: "Organization profile updated successfully" });
    } catch (error) {
        console.error("Update organization profile error:", error);
        return res.status(500).json({ success: false, message: "Failed to update organization profile" });
    }
};

const getOrganizationIdForGallery = (req) => {
    if (req.user.role === "CONTENT_ADMIN") return req.user.organization_id;
    return req.body.organization_id || req.query.organization_id;
};

const createGallery = async (req, res) => {
    try {
        const organizationId = getOrganizationIdForGallery(req);
        const { name, description, cover_image_url } = req.body;

        if (!organizationId || !name) {
            return res.status(400).json({ success: false, message: "organization_id and name are required" });
        }

        const [result] = await db.query(
            `INSERT INTO galleries (organization_id, name, description, cover_image_url)
             VALUES (?, ?, ?, ?)`,
            [organizationId, name, description || null, cover_image_url || null]
        );

        return res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("Create gallery error:", error);
        return res.status(500).json({ success: false, message: "Failed to create gallery" });
    }
};

const createGalleryImage = async (req, res) => {
    try {
        const organizationId = getOrganizationIdForGallery(req);
        const { title, image_url, description, sort_order } = req.body;

        if (!organizationId || !image_url) {
            return res.status(400).json({ success: false, message: "organization_id and image_url are required" });
        }

        const [galleries] = await db.query(
            "SELECT id FROM galleries WHERE id = ? AND organization_id = ?",
            [req.params.galleryId, organizationId]
        );

        if (galleries.length === 0) {
            return res.status(404).json({ success: false, message: "Gallery not found" });
        }

        const [result] = await db.query(
            `INSERT INTO gallery_images
                (gallery_id, title, image_url, description, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [req.params.galleryId, title || null, image_url, description || null, sort_order || 0]
        );

        return res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("Create gallery image error:", error);
        return res.status(500).json({ success: false, message: "Failed to create gallery image" });
    }
};

export { updateOrganizationProfile, createGallery, createGalleryImage };