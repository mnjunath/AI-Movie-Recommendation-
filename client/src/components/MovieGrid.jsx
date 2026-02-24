import MovieCard from "./MovieCard";
import { motion } from "framer-motion";

function MovieGrid({ movies }) {
    if (!movies || movies.length === 0) {
        return <p className="text-gray-500 text-center py-20 text-xl font-medium tracking-tight">No movies found.</p>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
        >
            {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
        </motion.div>
    );
}

export default MovieGrid;