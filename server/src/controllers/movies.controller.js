import {
  getTrendingMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getGenres,
  getMoviesByGenre
} from "../services/tmdb.service.js";

export const trending = async (req, res) => {
  try {
    const { page } = req.query;
    const data = await getTrendingMovies(page);
    res.json(data);
  } catch (error) {
    console.error("TRENDING ERROR:", error.message);
    res.status(500).json({ message: "Failed to get Trending Movies" });
  }
};

export const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const movies = await searchMovies(q);
    res.json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Search failed" });
  }
};


export const details = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await getMovieDetails(id);
    const credits = await getMovieCredits(id);
    const videos = await getMovieVideos(id);
    const similar = await getSimilarMovies(id);

    const director = credits.crew.find(
      (person) => person.job === "Director"
    );

    const trailer = videos.find(
      (video) =>
        video.type === "Trailer" && video.site === "YouTube"
    );

    res.json({
      movie,
      cast: credits.cast.slice(0, 10),
      director,
      trailer,
      similar
    });

  } catch (error) {
    console.error("DETAILS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch movie details" });
  }
};


export const genres = async (req, res) => {
  try {
    const genreList = await getGenres();
    res.json(genreList);
  } catch (error) {
    res.status(500).json({ message: "failed to get Genere" });
  }
}

export const byGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { page } = req.query;

    const movies = await getMoviesByGenre(id, page);

    res.json(movies);
  } catch (error) {
    console.error("BY GENRE ERROR:", error.message);
    res.status(500).json({ message: "failed to get movies by genre" });
  }
};
