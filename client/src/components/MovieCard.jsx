import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

function MovieCard({ movie, index = 0 }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.2 }
            }}
            onClick={handleClick}
            className="relative group cursor-pointer bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all border border-white/5"
        >
            {}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {}
            <div className="absolute bottom-0 inset-x-0 p-4 transition-all duration-300 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                <h3 className="text-sm font-bold truncate mb-1 shadow-black text-white drop-shadow-lg">
                    {movie.title}
                </h3>

                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                    <span>•</span>
                    <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                </div>
            </div>

            {}
            <div className="p-3 bg-surface group-hover:opacity-0 transition-opacity">
                <h3 className="text-xs font-semibold truncate text-gray-200">
                    {movie.title}
                </h3>
            </div>
        </motion.div>
    );
}

export default MovieCard;