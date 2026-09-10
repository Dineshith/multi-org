import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import bannerRoutes from "./src/routes/bannerRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";
import galleryImageRoutes from "./src/routes/galleryImageRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/gallery-images", galleryImageRoutes);
app.use("/api/notices", noticeRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Backend server is running");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});