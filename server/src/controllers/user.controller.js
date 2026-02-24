import User from "../models/User.js";
import { getMovieDetails } from "../services/tmdb.service.js";

export const likeMovie = async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.likedMovies.includes(Number(movieId))) {
    user.likedMovies.push(Number(movieId));


    const movie = await getMovieDetails(movieId);

    movie.genres.forEach(g => {
      const current = user.genreScores.get(g.name) || 0;
      user.genreScores.set(g.name, current + 3);
    });
  }

  await user.save();
  res.json({ message: "Movie liked" });
};

export const watchMovie = async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findById(req.userId);
  if (!user.watchHistory.includes(Number(movieId))) {
    user.watchHistory.push(Number(movieId));
  }

  await user.save();
  res.json({ message: "Movie added to history" });
};

export const dislikeMovie = async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findById(req.userId);

  if (!user.dislikedMovies.includes(Number(movieId))) {
    user.dislikedMovies.push(Number(movieId));
  }

  await user.save();
  res.json({ message: "Movie disliked" });
};