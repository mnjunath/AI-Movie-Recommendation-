import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTrendingMovies, searchMovies, getRecommendations, getMoviesByGenre } from "../api/api";
import SearchBar from "../components/SearchBar";
import AISearchBar from "../components/AISearchBar";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { ChevronRight, TrendingUp, Sparkles, Search, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const genreId = searchParams.get("genre");
    const genreName = searchParams.get("name");

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [view, setView] = useState("trending");
    const [heroMovie, setHeroMovie] = useState(null);

    const fetchTrending = async (targetPage) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTrendingMovies(targetPage);
            setMovies(data.results);
            setTotalPages(data.total_pages);

            if (targetPage === 1 && data.results.length > 0) {
                setHeroMovie(data.results[0]);
            }

            setView("trending");
        } catch (err) {
            setError("Failed to load trending movies");
        } finally {
            setLoading(false);
        }
    };

    const fetchByGenre = async (id, targetPage = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMoviesByGenre(id, targetPage);
            setMovies(data.results);
            setTotalPages(data.total_pages);
            setView("genre");
            setPage(targetPage);
            if (targetPage === 1) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (err) {
            setError("Failed to load genre archives.");
        } finally {
            setLoading(false);
        }
    };

    const loadedRef = useRef({ id: null, page: null });

    useEffect(() => {
        if (genreId) {

            if (genreId !== loadedRef.current.id) {
                loadedRef.current = { id: genreId, page: 1 };
                setPage(1);
                fetchByGenre(genreId, 1);
            }

            else if (page !== loadedRef.current.page) {
                loadedRef.current.page = page;
                fetchByGenre(genreId, page);
            }
        } else {

            if (loadedRef.current.id !== null) {
                loadedRef.current = { id: null, page: 1 };
                setView("trending");
                setPage(1);
                fetchTrending(1);
            } else if (view === "trending" && page !== loadedRef.current.page) {
                loadedRef.current.page = page;
                fetchTrending(page);
            }
        }
    }, [genreId, page]);

    const handleSearch = async (query) => {
        if (!query) return;
        setSearchParams({});
        try {
            setLoading(true);
            setError(null);
            const data = await searchMovies(query);
            setMovies(data.results || data);
            setView("search");
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError("Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAISearch = async (prompt) => {
        if (!prompt) return;
        setSearchParams({});
        try {
            setLoading(true);
            setError(null);
            const data = await getRecommendations(prompt);
            setMovies(data.recommendations || []);
            setView("ai");
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError("AI recommendation engine is currently unavailable.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            if (view === "trending" && page === 1 && !genreId) {
                window.scrollTo({ top: 400, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    if (loading && page === 1 && !movies.length) return <Loader message="Curating your cinema..." />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background"
        >
            {}
            <AnimatePresence mode="wait">
                {view === "trending" && page === 1 && heroMovie && !genreId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative h-[85vh] w-full overflow-hidden"
                    >
                        <div className="absolute inset-0">
                            <img
                                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
                                alt=""
                                className="w-full h-full object-cover scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 md:p-20 max-w-4xl z-10">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="flex items-center gap-2 text-purple-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">
                                    <TrendingUp className="w-4 h-4" />
                                    Trending This Week
                                </span>
                                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tighter">
                                    {heroMovie.title}
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => navigate(`/movie/${heroMovie.id}`)}
                                        className="bg-white text-black px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all scale-100 hover:scale-105"
                                    >
                                        View Details <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <div className={`max-w-7xl mx-auto px-6 ${view === "trending" && page === 1 && !genreId ? "-mt-16 relative z-20" : "pt-24"}`}>
                <div className="glass-dark p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
                    <div className="flex-1">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="flex-[2]">
                        <AISearchBar onAISearch={handleAISearch} />
                    </div>
                </div>

                {}
                <div className="mt-16 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view + (genreId || "")}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                        >
                            <div>
                                {(view !== "trending" || genreId) && (
                                    <button
                                        onClick={() => { setSearchParams({}); setView("trending"); setPage(1); }}
                                        className="mb-4 text-purple-500 hover:text-purple-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest transition-colors"
                                    >
                                        ← Return to Trending
                                    </button>
                                )}
                                <h2 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 tracking-tight">
                                    {genreId ? (
                                        <><Filter className="text-purple-500" /> {genreName || "Genre"} Movies</>
                                    ) : view === "trending" ? (
                                        <><TrendingUp className="text-purple-500" /> Trending Movies</>
                                    ) : view === "search" ? (
                                        <><Search className="text-blue-500" /> Search Results</>
                                    ) : (
                                        <><Sparkles className="text-purple-500" /> AI Recommended for You</>
                                    )}
                                </h2>
                            </div>

                            {(view === "trending" || view === "genre") && (
                                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-2 border border-white/5">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-colors"
                                    >
                                        ←
                                    </button>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 px-4">
                                        Page <span className="text-white">{page}</span>
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= totalPages}
                                        className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {error && <ErrorMessage message={error} onRetry={() => genreId ? fetchByGenre(genreId) : view === "trending" ? fetchTrending(page) : setView("trending")} />}

                    {(!loading || page > 1) && !error && (
                        <MovieGrid movies={movies} />
                    )}

                    {loading && (view !== "trending" || page > 1) && (
                        <div className="py-20 flex justify-center">
                            <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default Home;
