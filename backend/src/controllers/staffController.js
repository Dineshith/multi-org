import db from "../config/db.js";

const getOrgFilter = (req) => {
  const user = req.user;
  if (user.role === "SUPER_ADMIN") {
    return { orgId: null, scoped: false };
  }
  return { orgId: user.organization_id, scoped: true };
};

const getAllStaff = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `SELECT * FROM staff WHERE organization_id = ? ORDER BY created_at DESC`;
      params = [orgId];
    } else {
      query = `SELECT * FROM staff ORDER BY created_at DESC`;
      params = [];
    }

    const [staff] = await db.query(query, params);

    res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `SELECT * FROM staff WHERE id = ? AND organization_id = ? LIMIT 1`;
      params = [id, orgId];
    } else {
      query = `SELECT * FROM staff WHERE id = ? LIMIT 1`;
      params = [id];
    }

    const [staff] = await db.query(query, params);

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      staff: staff[0],
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
    });
  }
};

const createStaff = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    const {
      name,
      designation,
      department,
      email,
      phone,
      qualification,
      photo_url,
      bio,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const organization_id = scoped ? orgId : req.body.organization_id;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: "Organization is required",
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO staff
        (organization_id, name, designation, department, email, phone, qualification, photo_url, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        organization_id,
        name,
        designation || null,
        department || null,
        email || null,
        phone || null,
        qualification || null,
        photo_url || null,
        bio || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staffId: result.insertId,
    });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create staff",
    });
  }
};
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let checkQuery, checkParams;
    if (scoped) {
      checkQuery = `SELECT * FROM staff WHERE id = ? AND organization_id = ? LIMIT 1`;
      checkParams = [id, orgId];
    } else {
      checkQuery = `SELECT * FROM staff WHERE id = ? LIMIT 1`;
      checkParams = [id];
    }

    const [existing] = await db.query(checkQuery, checkParams);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const staff = existing[0];
    const {
      name,
      designation,
      department,
      email,
      phone,
      qualification,
      photo_url,
      bio,
    } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }
    }

    await db.query(
      `UPDATE staff SET
        name = ?,
        designation = ?,
        department = ?,
        email = ?,
        phone = ?,
        qualification = ?,
        photo_url = ?,
        bio = ?
      WHERE id = ?`,
      [
        name ?? staff.name,
        designation ?? staff.designation,
        department ?? staff.department,
        email ?? staff.email,
        phone ?? staff.phone,
        qualification ?? staff.qualification,
        photo_url ?? staff.photo_url,
        bio ?? staff.bio,
        id,
      ],
    );

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update staff",
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);

    let query, params;
    if (scoped) {
      query = `DELETE FROM staff WHERE id = ? AND organization_id = ?`;
      params = [id, orgId];
    } else {
      query = `DELETE FROM staff WHERE id = ?`;
      params = [id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete staff",
    });
  }
};

export { createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff };
