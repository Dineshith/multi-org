import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import organizationRoute from "./src/routes/admin/organizationRoute.js";
import userRoutes from "./src/routes/userRoutes.js";
import settingRoutes from "./src/routes/settingRoutes.js";
import staffRoutes from "./src/routes/staffRoutes.js";
import pageRoutes from "./src/routes/pageRoutes.js";
import newsRoutes from "./src/routes/newsRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import dashboardRoute from "./src/routes/admin/dashboardRoute.js";
import passwordResetRequestRoute from "./src/routes/admin/passwordResetRequestRoute.js";
import publicRoutes from "./src/routes/publicRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend origin
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// AUTH and resource routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admin/organizations", organizationRoute);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/api/admin/password-requests", passwordResetRequestRoute);

// Public (unauthenticated) tenant site routes
app.use("/api/public", publicRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Backend server is running");
});
// Start server
const PORT = process.env.PORT || 6000;
app.get("/test-org", (req, res) => {
    console.log("TEST ORG ROUTE HIT");

    res.json({
        message: "Server is using the current server.js"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});