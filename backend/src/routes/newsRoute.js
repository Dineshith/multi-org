import express from "express";

import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getAllNews);

router.get("/:id", getNewsById);

router.post("/", createNews);

router.put("/:id", updateNews);

router.delete("/:id", deleteNews);

export default router;