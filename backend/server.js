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

dotenv.config();

const app = express();

// Middleware
app.use(cors("http://localhost:5173")); //full frontend access, empty-give access to all
app.use(express.json());

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