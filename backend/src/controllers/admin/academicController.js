import db from "../../config/db.js";

const organizationIdFor = (req) => {
    if (req.user.role === "CONTENT_ADMIN") return req.user.organization_id;
    return req.body.organization_id || req.query.organization_id;
};

const programBelongsToOrganization = async (programId, organizationId) => {
    const [rows] = await db.query(
        "SELECT id FROM programs WHERE id = ? AND organization_id = ?",
        [programId, organizationId]
    );
    return rows.length > 0;
};

const getFeeStructures = async (req, res) => {
    try {
        const organizationId = organizationIdFor(req);
        const [rows] = await db.query(
                `SELECT id, id AS program_id, name AS program_name,
                    admission_fee, annual_fee, monthly_fee, other_fee
                 FROM programs
                 WHERE organization_id = ?
                 ORDER BY name ASC`,
            [organizationId]
        );
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Get fee structures error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch fee structures" });
    }
};

const createFeeStructure = async (req, res) => {
    try {
        const organizationId = organizationIdFor(req);
        const { program_id, admission_fee, annual_fee, monthly_fee, other_fee } = req.body;

        if (!organizationId || !program_id) {
            return res.status(400).json({ success: false, message: "organization_id and program_id are required" });
        }

        if (!await programBelongsToOrganization(program_id, organizationId)) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        const [result] = await db.query(
            `UPDATE programs
             SET admission_fee = ?, annual_fee = ?, monthly_fee = ?, other_fee = ?
             WHERE id = ? AND organization_id = ?`,
            [admission_fee || 0, annual_fee || 0, monthly_fee || 0, other_fee || 0, program_id, organizationId]
        );

        return res.status(200).json({ success: true, message: "Fee structure updated successfully" });
    } catch (error) {
        console.error("Create fee structure error:", error);
        return res.status(500).json({ success: false, message: "Failed to create fee structure" });
    }
};

const updateFeeStructure = async (req, res) => {
    try {
        const organizationId = organizationIdFor(req);
        const { admission_fee, annual_fee, monthly_fee, other_fee } = req.body;
        const [result] = await db.query(
            `UPDATE programs
             SET admission_fee = ?, annual_fee = ?, monthly_fee = ?, other_fee = ?
             WHERE id = ? AND organization_id = ?`,
            [admission_fee || 0, annual_fee || 0, monthly_fee || 0, other_fee || 0,
                req.params.id, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }
        return res.json({ success: true, message: "Fee structure updated successfully" });
    } catch (error) {
        console.error("Update fee structure error:", error);
        return res.status(500).json({ success: false, message: "Failed to update fee structure" });
    }
};

const deleteFeeStructure = async (req, res) => {
    return res.status(400).json({
        success: false,
        message: "Fee structures belong to programs and cannot be deleted separately"
    });
};

const getAdmissionCriteria = async (req, res) => {
    try {
        const organizationId = organizationIdFor(req);
        const [rows] = await db.query(
            `SELECT id AS program_id, name AS program_name, admission_criteria
             FROM programs
             WHERE organization_id = ?
             ORDER BY name ASC`,
            [organizationId]
        );
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Get admission criteria error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch admission criteria" });
    }
};

const createAdmissionCriteria = async (req, res) => {
    try {
        const organizationId = organizationIdFor(req);
        const { program_id, criteria } = req.body;

        if (!organizationId || !program_id || !criteria) {
            return res.status(400).json({ success: false, message: "organization_id, program_id and criteria are required" });
        }

        if (!await programBelongsToOrganization(program_id, organizationId)) {
            return res.status(404).json({ success: false, message: "Program not found" });
        }

        const [result] = await db.query(
            `UPDATE programs
             SET admission_criteria = ?
             WHERE id = ? AND organization_id = ?`,
            [typeof criteria === "string" ? criteria : JSON.stringify(criteria), program_id, organizationId]
        );
        return res.status(200).json({ success: true, message: "Admission criteria updated successfully" });
    } catch (error) {
        console.error("Create admission criteria error:", error);
        return res.status(500).json({ success: false, message: "Failed to create admission criteria" });
    }
};

export {
    getFeeStructures,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    getAdmissionCriteria,
    createAdmissionCriteria
};