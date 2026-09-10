import db from "../config/db.js";

// =====================================
// CREATE CONTACT MESSAGE
// =====================================
const createContact = async (req, res) => {
    try {
        const {
            full_name,
            emailAddress,
            phoneNumber,
            subject,
            message
        } = req.body;

        // Required fields
        if (
            !full_name ||
            !emailAddress ||
            !phoneNumber ||
            !subject ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const [result] = await db.query(
            `INSERT INTO Contact
            (full_name, emailAddress, phoneNumber, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
            [
                full_name,
                emailAddress,
                phoneNumber,
                subject,
                message
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contactId: result.insertId
        });

    } catch (error) {
        console.error("CREATE CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
};


// =====================================
// GET ALL CONTACT MESSAGES - ADMIN
// =====================================
const getAllContacts = async (req, res) => {
    try {
        const [contacts] = await db.query(
            `SELECT *
             FROM Contact
             ORDER BY createdAt DESC`
        );

        return res.status(200).json({
            success: true,
            contacts
        });

    } catch (error) {
        console.error("GET CONTACTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contact messages",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE CONTACT - ADMIN
// =====================================
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const [contacts] = await db.query(
            "SELECT * FROM Contact WHERE id = ?",
            [id]
        );

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        return res.status(200).json({
            success: true,
            contact: contacts[0]
        });

    } catch (error) {
        console.error("GET CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contact message",
            error: error.message
        });
    }
};


// =====================================
// DELETE CONTACT - ADMIN
// =====================================
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM Contact WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });

    } catch (error) {
        console.error("DELETE CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete contact message",
            error: error.message
        });
    }
};


// =====================================
// EXPORT
// =====================================
export {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
};