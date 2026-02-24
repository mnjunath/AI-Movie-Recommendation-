import {
  searchMovies,
  getMovieDetails,
  getSimilarMovies,
  discoverMovies,
  getGenres
} from "../services/tmdb.service.js";

import { analyzeAndRecommend } from "../services/ai.service.js";
import User from "../models/User.js";

export const recommendMovies = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const user = await User.findById(req.userId);


    const aiData = await analyzeAndRecommend(prompt);

    const {
      recommended_titles = [],
      genres = [],
      actor,
      director,
      keywords,
      year_from,
      year_to,
      franchise
    } = aiData;

    let candidates = [];


    const discoverResults = await discoverMovies({
      genres,
      actor,
      director,
      keywords,
      year_from,
      year_to,
      franchise
    });

    candidates.push(...discoverResults);


    for (let title of recommended_titles) {
      const searchResults = await searchMovies(title);

      if (searchResults.length > 0) {
        const movie = await getMovieDetails(searchResults[0].id);
        candidates.push(movie);

        const similar = await getSimilarMovies(movie.id);
        candidates.push(...similar.slice(0, 5));
      }
    }


    candidates = candidates.map(movie => ({
      ...movie,
      id: Number(movie.id)
    }));


    if (user?.watchHistory?.length) {
      candidates = candidates.filter(
        movie => !user.watchHistory.includes(movie.id)
      );
    }


    candidates = candidates.filter(
      (movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
    );


    candidates = candidates.map(movie => {
      let genreIds = [];

      if (movie.genre_ids) {
        genreIds = movie.genre_ids;
      } else if (movie.genres) {
        genreIds = movie.genres.map(g => g.id);
      }

      return { ...movie, genre_ids: genreIds };
    });


    const allGenres = await getGenres();

    let userGenreIds = [];

    if (genres.length) {
      for (let userGenre of genres) {
        const match = allGenres.find(
          g => g.name.toLowerCase() === userGenre.toLowerCase()
        );
        if (match) {
          userGenreIds.push(match.id);
        }
      }
    }


    const historicalGenreWeights = new Map();
    if (user?.genreScores) {
      for (let [genreName, count] of user.genreScores) {
        const match = allGenres.find(
          g => g.name.toLowerCase() === genreName.toLowerCase()
        );
        if (match) {
          historicalGenreWeights.set(match.id, count);
        }
      }
    }


    candidates = candidates.map(movie => {
      let score = 0;


      if (userGenreIds.length && movie.genre_ids?.length) {
        const overlap = movie.genre_ids.filter(id =>
          userGenreIds.includes(id)
        );

        score += overlap.length * 15;
      }


      if (historicalGenreWeights.size && movie.genre_ids?.length) {
        movie.genre_ids.forEach(id => {
          if (historicalGenreWeights.has(id)) {
            score += historicalGenreWeights.get(id) * 8;
          }
        });
      }


      score += (movie.vote_average || 0) * 3;


      score += (movie.popularity || 0) / 50;


      score += Math.log(movie.vote_count || 1) * 2;


      if (
        recommended_titles.some(title =>
          movie.title?.toLowerCase().includes(title.toLowerCase())
        )
      ) {
        score += 30;
      }

      return { ...movie, score };
    });


    candidates = candidates.filter(
      (movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
    );


    candidates.sort((a, b) => b.score - a.score);


    res.json({
      prompt,
      filters: aiData,
      totalCandidates: candidates.length,
      recommendations: candidates.slice(0, 20)
    });

  } catch (error) {
    console.error("Hybrid Recommendation Error:", error.message);
    res.status(500).json({ message: "Recommendation failed" });
  }
};