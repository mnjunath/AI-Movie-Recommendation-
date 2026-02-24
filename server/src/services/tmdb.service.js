import axios from "axios";
import axiosRetry from "axios-retry";
import https from "https";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3"
});

axiosRetry(tmdb, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.code === "ECONNRESET" || axiosRetry.isNetworkError(error);
  }
});


tmdb.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});



export const getTrendingMovies = async (page = 1) => {
  const { data } = await tmdb.get("/trending/movie/week", {
    params: { page }
  });
  return data;
};


export const searchMovies = async (query) => {
  const { data } = await tmdb.get("/search/movie", {
    params: { query }
  });
  return data.results;
};


export const getMovieDetails = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
};


export const getMovieCredits = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/credits`);
  return data;
};


export const getMovieVideos = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/videos`);
  return data.results;
};


export const getSimilarMovies = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}/similar`);
  return data.results;
};


export const getGenres = async () => {
  const { data } = await tmdb.get("/genre/movie/list");
  return data.genres;
};


export const getMoviesByGenre = async (genreId, page = 1) => {
  const { data } = await tmdb.get("/discover/movie", {
    params: { with_genres: genreId, page }
  });
  return data;
};

export const searchPerson = async (name) => {
  const { data } = await tmdb.get("/search/person", {
    params: { query: name }
  });
  return data.results[0];
};

export const searchKeyword = async (keyword) => {
  const { data } = await tmdb.get("/search/keyword", {
    params: { query: keyword }
  });
  return data.results[0];
};

export const discoverMovies = async (filters) => {
  const params = {};
  let requiredGenreIds = [];


  if (filters.genres?.length) {
    const genres = await getGenres();
    const matchedGenreIds = [];

    for (let userGenre of filters.genres) {
      const lowerUserGenre = userGenre.toLowerCase();

      for (let tmdbGenre of genres) {
        const lowerTmdbGenre = tmdbGenre.name.toLowerCase();

        if (
          lowerUserGenre === lowerTmdbGenre ||
          lowerUserGenre.includes(lowerTmdbGenre) ||
          lowerTmdbGenre.includes(lowerUserGenre)
        ) {
          matchedGenreIds.push(tmdbGenre.id);
        }
      }
    }

    requiredGenreIds = [...new Set(matchedGenreIds)];

    if (requiredGenreIds.length) {
      params.with_genres = requiredGenreIds.join(",");
    }
  }


  if (filters.actor) {
    const person = await searchPerson(filters.actor);
    if (person) {
      params.with_cast = person.id;
    }
  }


  if (filters.director) {
    const person = await searchPerson(filters.director);
    if (person) {
      params.with_crew = person.id;
    }
  }


  if (filters.keywords?.length) {
    const keywordIds = [];

    for (let keyword of filters.keywords) {
      const found = await searchKeyword(keyword);
      if (found) {
        keywordIds.push(found.id);
      }
    }

    if (keywordIds.length) {
      params.with_keywords = keywordIds.join(",");
    }
  }


  const franchiseMap = {
    marvel: 420,
    "marvel cinematic universe": 420,
    pixar: 3,
    dc: 9993
  };

  if (filters.franchise) {
    const key = filters.franchise.toLowerCase();
    if (franchiseMap[key]) {
      params.with_companies = franchiseMap[key];
    }
  }


  if (filters.year_from) {
    params["primary_release_date.gte"] = `${filters.year_from}-01-01`;
  }

  if (filters.year_to) {
    params["primary_release_date.lte"] = `${filters.year_to}-12-31`;
  }


  params.sort_by = "popularity.desc";
  params["vote_count.gte"] = 200;
  params.with_original_language = "en";

  const { data } = await tmdb.get("/discover/movie", { params });

  let results = data.results || [];


  if (requiredGenreIds.length) {
    results = results.filter(movie =>
      requiredGenreIds.every(id => movie.genre_ids.includes(id))
    );
  }


  results = results.map(movie => {
    let score = 0;

    score += movie.vote_average * 2;
    score += movie.popularity / 100;

    return { ...movie, score };
  });

  results.sort((a, b) => b.score - a.score);


  if (results.length === 0) {
    return await searchMovies(filters.franchise || filters.keywords?.join(" ") || "");
  }

  return results;
};
