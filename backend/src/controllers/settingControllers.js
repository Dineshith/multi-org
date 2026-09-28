import db from "../config/db.js";

const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings LIMIT 1");

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    res.status(200).json({
      success: true,
      settings: rows[0],
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { system_name, system_logo_url, system_email, system_phone } =
      req.body;

    if (!system_name) {
      return res.status(400).json({
        success: false,
        message: "System name is required",
      });
    }

    const [existing] = await db.query("SELECT id FROM settings LIMIT 1");

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO settings (system_name, system_logo_url, system_email, system_phone)
         VALUES (?, ?, ?, ?)`,
        [
          system_name,
          system_logo_url || null,
          system_email || null,
          system_phone || null,
        ],
      );
    } else {
      const settingsId = existing[0].id;
      await db.query(
        `UPDATE settings SET
          system_name = ?,
          system_logo_url = ?,
          system_email = ?,
          system_phone = ?
        WHERE id = ?`,
        [
          system_name,
          system_logo_url || null,
          system_email || null,
          system_phone || null,
          settingsId,
        ],
      );
    }

    const [rows] = await db.query("SELECT * FROM settings LIMIT 1");

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: rows[0],
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

export { getSettings, updateSettings };
