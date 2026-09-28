import pool from "../../config/db.js";
import generateSlug from "../../utils/generateSlug.js";

// CREATE ORGANIZATION

export const createOrganization = async (req, res) => {
  console.log("hit");
  console.log("body", req.body);
  
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
            copyright_text
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
                copyright_text
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            copyright_text || null
        ];

        const [result] = await pool.execute(sql, values);

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
            data: rows
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
            data: rows[0]
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
            copyright_text
        } = req.body;

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
                copyright_text = ?
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