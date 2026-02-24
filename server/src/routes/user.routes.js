import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  likeMovie,
  watchMovie,
  dislikeMovie
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/like/:movieId", authMiddleware, likeMovie);
router.post("/watch/:movieId", authMiddleware, watchMovie);
router.post("/dislike/:movieId", authMiddleware, dislikeMovie);

export default router;