import express from "express";
import { createCollegeDetail } from "../controllers/collegeDetail.controller.js";

const router = express.Router();

router.post("/college-details", createCollegeDetail);

export default router;