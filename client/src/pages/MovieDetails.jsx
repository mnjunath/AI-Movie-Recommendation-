import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getMovieDetails, likeMovie, dislikeMovie, watchMovie } from "../api/api";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { Star, Clock, Calendar, ChevronLeft, ThumbsUp, ThumbsDown, Play, Users } from "lucide-react";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);


    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getMovieDetails(id);
                setData(response);

                try {
                    await watchMovie(id);
                } catch (watchErr) {
                    console.error("Failed to track watch history", watchErr);
                }
            } catch (err) {
                setError("Cinematic archive encounterd an error.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleLike = async () => {
        if (actionLoading) return;
        try {
            setActionLoading(true);
            await likeMovie(id);
            setIsLiked(true);
            setIsDisliked(false);
        } catch (err) {
            console.error("Failed to like movie", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDislike = async () => {
        if (actionLoading) return;
        try {
            setActionLoading(true);
            await dislikeMovie(id);
            setIsDisliked(true);
            setIsLiked(false);
        } catch (err) {
            console.error("Failed to dislike movie", err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Loader message="Opening the cinematic vault..." />;
    if (error) return <ErrorMessage message={error} onRetry={() => navigate("/")} />;
    if (!data || !data.movie) return null;

    const { movie, cast, director, trailer } = data;
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
    const trailerThumbnail = trailer ? `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg` : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background text-white selection:bg-accent"
        >
            {}
            <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
                <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
                    {backdropUrl && (
                        <img
                            src={backdropUrl}
                            alt=""
                            className="w-full h-full object-cover scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </motion.div>

                <div className="absolute top-8 left-8 z-50">
                    <button
                        onClick={() => navigate("/")}
                        className="glass-dark p-3 rounded-full hover:bg-white/10 transition-colors group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {}
            <div className="max-w-7xl mx-auto px-6 -mt-64 relative z-10 pb-32">
                <div className="flex flex-col lg:flex-row gap-16">
                    {}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-72 md:w-96 flex-shrink-0 mx-auto lg:mx-0"
                    >
                        <div className="sticky top-10">
                            <motion.img
                                layoutId={`movie-poster-${movie.id}`}
                                src={posterUrl}
                                alt={movie.title}
                                className="w-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 mb-8"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleLike}
                                    disabled={actionLoading || isLiked}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${isLiked ? "bg-green-600 text-white" : "glass hover:bg-white/10"
                                        }`}
                                >
                                    <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                    {isLiked ? "Liked" : "Like"}
                                </button>
                                <button
                                    onClick={handleDislike}
                                    disabled={actionLoading || isDisliked}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${isDisliked ? "bg-red-600 text-white" : "glass hover:bg-white/10"
                                        }`}
                                >
                                    <ThumbsDown className={`w-5 h-5 ${isDisliked ? "fill-current" : ""}`} />
                                    {isDisliked ? "Disliked" : "Dislike"}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <div className="flex-grow">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter leading-tight italic">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 mb-10 text-gray-400 font-medium">
                                <span className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg">
                                    <Star className="w-5 h-5 fill-current" />
                                    {movie.vote_average?.toFixed(1) || "N/A"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                    {movie.release_date?.split("-")[0]}
                                </span>
                                {movie.runtime && (
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        {movie.runtime}m
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-12">
                                {movie.genres?.map((g) => (
                                    <span key={g.id} className="text-xs font-bold px-4 py-2 rounded-full glass uppercase tracking-widest text-purple-400">
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-16">
                                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-purple-500" /> Plot Summary
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-4xl italic">
                                    "{movie.overview}"
                                </p>
                            </div>

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                                {director && (
                                    <div className="glass-dark p-6 rounded-2xl border-l-4 border-purple-500">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Director</span>
                                        <p className="text-2xl font-bold">{director.name}</p>
                                    </div>
                                )}
                                {cast && cast.length > 0 && (
                                    <div className="glass-dark p-6 rounded-2xl border-l-4 border-blue-500">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4" /> Leading Cast
                                        </span>
                                        <p className="text-lg text-gray-300 leading-relaxed">
                                            {cast.slice(0, 5).map(c => c.name).join(", ")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {}
                            {trailer && (
                                <div className="mt-20">
                                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
                                        <div className="w-8 h-[1px] bg-red-500" /> Official Preview
                                    </h2>

                                    <AnimatePresence mode="wait">
                                        {!isPlaying ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative aspect-video rounded-3xl overflow-hidden glass group cursor-pointer border-white/5"
                                                onClick={() => setIsPlaying(true)}
                                            >
                                                <img
                                                    src={trailerThumbnail}
                                                    alt=""
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-red-600 transition-all group-hover:border-transparent">
                                                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="aspect-video rounded-3xl overflow-hidden glass shadow-2xl shadow-purple-500/10"
                                            >
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MovieDetails;
