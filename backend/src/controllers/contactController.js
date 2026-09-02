import db from "../config/db.js";

// =========================
// CREATE CONTACT MESSAGE
// =========================
const createContact = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            subject,
            message
        } = req.body;

        if (!full_name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const [result] = await db.query(
            `INSERT INTO contacts
            (full_name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                phone || null,
                subject,
                message
            ]
        );

        res.status(201).json({
            success: true,
            message: "Contact message sent successfully",
            contactId: result.insertId
        });

    } catch (error) {
        console.error("Create contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send contact message"
        });
    }
};


// =========================
// GET ALL CONTACT MESSAGES
// =========================
const getAllContacts = async (req, res) => {
    try {
        const [contacts] = await db.query(
            "SELECT * FROM contacts ORDER BY created_at DESC"
        );

        res.status(200).json({
            success: true,
            contacts
        });

    } catch (error) {
        console.error("Get contacts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch contact messages"
        });
    }
};


// =========================
// GET SINGLE CONTACT
// =========================
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const [contacts] = await db.query(
            "SELECT * FROM contacts WHERE id = ?",
            [id]
        );

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            contact: contacts[0]
        });

    } catch (error) {
        console.error("Get contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch contact message"
        });
    }
};


// =========================
// DELETE CONTACT MESSAGE
// =========================
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM contacts WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });

    } catch (error) {
        console.error("Delete contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete contact message"
        });
    }
};


export { createContact, getAllContacts, getContactById, deleteContact };