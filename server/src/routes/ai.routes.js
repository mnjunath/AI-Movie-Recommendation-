import express from "express";
import { recommendMovies } from "../controllers/ai.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/recommend", authMiddleware, recommendMovies);

export default router;
