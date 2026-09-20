import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import organizationRoute from "./src/routes/admin/organizationRoute.js";
import userRoute from "./src/routes/admin/userRoute.js";
import contentRoute from "./src/routes/admin/contentRoute.js";
import pageRoute from "./src/routes/admin/pageRoute.js";
import publicRoutes from "./src/routes/publicRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admin", organizationRoute)
app.use("/api/admin", userRoute);
app.use("/api/content-admin", contentRoute);
app.use("/api/content-admin", pageRoute);
app.use("/api/public", publicRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Backend server is running");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
