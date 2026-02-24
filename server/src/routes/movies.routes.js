import { trending, search, details, genres, byGenre } from "../controllers/movies.controller.js";
import express from "express";

const router = express.Router();

router.get("/trending", trending);
router.get("/search", search);
router.get("/genres", genres);
router.get("/genre/:id", byGenre);
router.get("/:id", details);

export default router;