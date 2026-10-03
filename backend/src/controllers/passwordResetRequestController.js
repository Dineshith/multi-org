import db from "../config/db.js";

// The reset token is created up-front by /api/auth/forgot-password but is only
// ever revealed once a super admin approves the request, so the queue can hold
// pending rows without leaking a working token.
const LIST_COLUMNS = `id, user_id, organization_id, org_name, admin_name,
      admin_email, status, handled_by, handled_at, created_at`;

const getAllPasswordResetRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const params = [];
    let query = `SELECT ${LIST_COLUMNS} FROM password_reset_requests`;

    if (status) {
      const allowed = ["PENDING", "ACCEPTED", "REJECTED"];
      const normalized = String(status).toUpperCase();

      if (!allowed.includes(normalized)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${allowed.join(", ")}`,
        });
      }

      query += ` WHERE status = ?`;
      params.push(normalized);
    }

    query += ` ORDER BY
        CASE status WHEN 'PENDING' THEN 0 ELSE 1 END,
        created_at DESC`;

    const [requests] = await db.query(query, params);

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Get password reset requests error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch password reset requests" });
  }
};

const getPasswordResetRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(
      `SELECT ${LIST_COLUMNS} FROM password_reset_requests WHERE id = ? LIMIT 1`,
      [id],
    );

    if (requests.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Password reset request not found" });
    }

    return res.status(200).json({ success: true, request: requests[0] });
  } catch (error) {
    console.error("Get password reset request error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch password reset request" });
  }
};

// Approving or rejecting a request is a one-way transition out of PENDING.
const updatePasswordResetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const normalized = String(status || "").toUpperCase();

    if (!["ACCEPTED", "REJECTED"].includes(normalized)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACCEPTED or REJECTED",
      });
    }

    const [existing] = await db.query(
      `SELECT id, status FROM password_reset_requests WHERE id = ? LIMIT 1`,
      [id],
    );

    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Password reset request not found" });
    }

    if (existing[0].status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: `Request has already been ${existing[0].status.toLowerCase()}`,
      });
    }

    await db.query(
      `UPDATE password_reset_requests
       SET status = ?, handled_by = ?, handled_at = NOW()
       WHERE id = ?`,
      [normalized, req.user.id, id],
    );

    if (normalized === "ACCEPTED") {
      // Surface the token so it can be emailed; resetPassword() consumes it.
      const [approved] = await db.query(
        `SELECT token FROM password_reset_requests WHERE id = ? LIMIT 1`,
        [id],
      );

      console.log(
        "PASSWORD RESET APPROVED FOR REQUEST:",
        id,
        "TOKEN:",
        approved[0]?.token,
      );
    } else {
      // A rejected request must not stay usable.
      await db.query(
        `UPDATE password_reset_tokens
         SET used = TRUE
         WHERE user_id = (
           SELECT user_id FROM (
             SELECT user_id FROM password_reset_requests WHERE id = ?
           ) AS tmp
         )
           AND used = FALSE`,
        [id],
      );
    }

    return res.status(200).json({
      success: true,
      message: `Password reset request ${normalized.toLowerCase()}`,
    });
  } catch (error) {
    console.error("Update password reset request error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update password reset request" });
  }
};

export {
  getAllPasswordResetRequests,
  getPasswordResetRequestById,
  updatePasswordResetRequest,
};