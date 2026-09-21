import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import organizationRoute from "./src/routes/admin/organizationRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// AUTH ROUTES
// Super Admin authentication
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admin", organizationRoute);


// Test route
app.get("/", (req, res) => {
    res.send("Backend server is running");
});
// Start server
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});