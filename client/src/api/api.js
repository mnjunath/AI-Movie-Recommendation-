import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const loginUser = async (data) => {
    const response = await API.post("/auth/login", data);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await API.post("/auth/register", data);
    return response.data;
};

export const getTrendingMovies = async (page = 1) => {
    const response = await API.get(`/movies/trending?page=${page}`);
    return response.data;
};

export const searchMovies = async (query) => {
    const response = await API.get(
        `/movies/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
};

export const getMovieDetails = async (id) => {
    const response = await API.get(`/movies/${id}`);
    return response.data;
};

export const getRecommendations = async (prompt) => {
    const response = await API.post("/ai/recommend", { prompt });
    return response.data;
};

export const likeMovie = async (movieId) => {
    const response = await API.post(`/user/like/${movieId}`);
    return response.data;
};

export const dislikeMovie = async (movieId) => {
    const response = await API.post(`/user/dislike/${movieId}`);
    return response.data;
};

export const watchMovie = async (movieId) => {
    const response = await API.post(`/user/watch/${movieId}`);
    return response.data;
};

export const getGenres = async () => {
    const response = await API.get("/movies/genres");
    return response.data;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    const response = await API.get(`/movies/genre/${genreId}?page=${page}`);
    return response.data;
};