import db from "../config/db.js";

const shapeEvent = (event) => {
  if (!event) return event;
  return {
    ...event,
    image: event.image_url || null,
    image_url: event.image_url || null,
  };
};

const getOrgFilter = (req) => {
  const user = req.user;
  if (!user || user.role === "SUPER_ADMIN") return { orgId: null, scoped: false };
  return { orgId: user.organization_id, scoped: true };
};

const getAllEvents = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `SELECT * FROM events WHERE organization_id = ? ORDER BY created_at DESC`;
      params = [orgId];
    } else {
      query = `SELECT * FROM events ORDER BY created_at DESC`;
      params = [];
    }
    const [events] = await db.query(query, params);
    res.status(200).json({ success: true, events: events.map(shapeEvent) });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `SELECT * FROM events WHERE id = ? AND organization_id = ? LIMIT 1`;
      params = [id, orgId];
    } else {
      query = `SELECT * FROM events WHERE id = ? LIMIT 1`;
      params = [id];
    }
    const [events] = await db.query(query, params);
    if (events.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, event: shapeEvent(events[0]) });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
};

const createEvent = async (req, res) => {
  try {
    const { orgId, scoped } = getOrgFilter(req);
    const { title, description, image_url, image, event_date, date, publish_on_main_portal } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    const organization_id = scoped ? orgId : req.body.organization_id;
    if (!organization_id) {
      return res.status(400).json({ success: false, message: "Organization is required" });
    }

    const processedImageUrl = processImageInput(image_url || image, "event");
    const resolvedEventDate = event_date || date || null;

    const [result] = await db.query(
      `INSERT INTO events (organization_id, title, description, image_url, event_date, publish_on_main_portal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        organization_id,
        title,
        description || null,
        processedImageUrl,
        resolvedEventDate,
        publish_on_main_portal === true || publish_on_main_portal === "true",
      ]
    );
    const [created] = await db.query(`SELECT * FROM events WHERE id = ? LIMIT 1`, [result.insertId]);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      eventId: result.insertId,
      event: shapeEvent(created[0]) || null,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);
    let checkQuery, checkParams;
    if (scoped) {
      checkQuery = `SELECT * FROM events WHERE id = ? AND organization_id = ? LIMIT 1`;
      checkParams = [id, orgId];
    } else {
      checkQuery = `SELECT * FROM events WHERE id = ? LIMIT 1`;
      checkParams = [id];
    }
    const [existing] = await db.query(checkQuery, checkParams);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    const event = existing[0];
    const { title, description, image_url, image, event_date, date, publish_on_main_portal } = req.body;

    const rawImage = image_url !== undefined ? image_url : image;
    const processedImageUrl =
      rawImage !== undefined
        ? processImageInput(rawImage, "event")
        : event.image_url;

    const resolvedEventDate = event_date !== undefined ? event_date : (date !== undefined ? date : event.event_date);

    await db.query(
      `UPDATE events SET title = ?, description = ?, image_url = ?, event_date = ?, publish_on_main_portal = ? WHERE id = ?`,
      [
        title ?? event.title,
        description ?? event.description,
        processedImageUrl,
        resolvedEventDate,
        publish_on_main_portal !== undefined
          ? (publish_on_main_portal === true || publish_on_main_portal === "true")
          : event.publish_on_main_portal,
        id,
      ]
    );
    const [updated] = await db.query(`SELECT * FROM events WHERE id = ? LIMIT 1`, [id]);
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: shapeEvent(updated[0]) || null,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, scoped } = getOrgFilter(req);
    let query, params;
    if (scoped) {
      query = `DELETE FROM events WHERE id = ? AND organization_id = ?`;
      params = [id, orgId];
    } else {
      query = `DELETE FROM events WHERE id = ?`;
      params = [id];
    }
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};

export { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };