import bcrypt from "bcryptjs";
import db from "../config/db.js";

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.organization_id, u.name, u.email, u.profile_photo_url, u.role, u.token_version, u.created_at,
              o.name AS organization_name, o.slug AS organization_slug, o.status AS organization_status
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       ORDER BY u.created_at DESC`,
    );
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      `SELECT u.id, u.organization_id, u.name, u.email, u.profile_photo_url, u.role, u.token_version, u.created_at, u.updated_at,
              o.name AS organization_name, o.slug AS organization_slug, o.status AS organization_status
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = ? LIMIT 1`,
      [id],
    );
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: users[0] });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      organization_id,
      role,
      profile_photo_url,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const userRole = role || "ORG_ADMIN";

    if (!["SUPER_ADMIN", "ORG_ADMIN"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }
    if (userRole === "SUPER_ADMIN" && organization_id) {
      return res.status(400).json({
        success: false,
        message: "Super Admin cannot belong to an organization",
      });
    }
    if (userRole === "ORG_ADMIN" && !organization_id) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required for Org Admin",
      });
    }

    if (userRole === "ORG_ADMIN") {
      const [organizations] = await db.query(
        `SELECT id FROM organizations WHERE id = ? LIMIT 1`,
        [organization_id]
      );

      if (organizations.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }
    }

    const [existing] = await db.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users
      (
        organization_id,
        name,
        email,
        password_hash,
        profile_photo_url,
        role
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userRole === "SUPER_ADMIN" ? null : organization_id,
        name,
        email,
        password_hash,
        profile_photo_url || null,
        userRole,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });

  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, organization_id, role, profile_photo_url } =
      req.body;

    const [existing] = await db.query(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = existing[0];

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email address" });
      }
      const [emailCheck] = await db.query(
        `SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1`,
        [email, id],
      );
      if (emailCheck.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }

    let password_hash = user.password_hash;
    let token_version = user.token_version;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      password_hash = await bcrypt.hash(password, 10);
      // Invalidate existing JWTs.
      token_version = Number(user.token_version) + 1;
    }

    await db.query(
      `UPDATE users SET
        organization_id = ?,
        name = ?,
        email = ?,
        password_hash = ?,
        profile_photo_url = ?,
        role = ?,
        token_version = ?
      WHERE id = ?`,
      [
        organization_id !== undefined ? organization_id : user.organization_id,
        name ?? user.name,
        email ?? user.email,
        password_hash,
        profile_photo_url !== undefined
          ? profile_photo_url
          : user.profile_photo_url,
        role ?? user.role,
        token_version,
        id,
      ],
    );

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `SELECT id FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export { createUser, deleteUser, getAllUsers, getUserById, updateUser };
