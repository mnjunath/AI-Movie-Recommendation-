import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getGenres } from "../api/api";
import { ChevronDown, LogOut, Film, Menu, X } from "lucide-react";

function Navbar({ onLogout }) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await getGenres();
                setGenres(data.genres || data);
            } catch (err) {
                console.error("Failed to fetch genres", err);
            }
        };
        fetchGenres();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleGenreSelect = (genre) => {
        setIsGenreOpen(false);
        setIsMobileMenuOpen(false);
        navigate(`/?genre=${genre.id}&name=${encodeURIComponent(genre.name)}`);
    };

    const handleSignOut = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? "bg-background/80 backdrop-blur-xl py-4 shadow-2xl" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                { }
                <Link
                    to="/"
                    onClick={() => setSearchParams({})}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Film className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MOVIE<span className="text-purple-500">AI</span>
                    </span>
                </Link>

                { }
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        onClick={() => setSearchParams({})}
                        className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        Home
                    </Link>

                    { }
                    <div className="relative">
                        <button
                            onMouseEnter={() => setIsGenreOpen(true)}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-2"
                        >
                            Genres <ChevronDown className={`w-4 h-4 transition-transform ${isGenreOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {isGenreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    onMouseLeave={() => setIsGenreOpen(false)}
                                    className="absolute top-full left-0 mt-2 w-64 bg-surface border border-white/5 rounded-2xl shadow-2xl p-4 overflow-hidden backdrop-blur-3xl"
                                >
                                    <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {genres.map((genre) => (
                                            <button
                                                key={genre.id}
                                                onClick={() => handleGenreSelect(genre)}
                                                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between group"
                                            >
                                                {genre.name}
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-6 w-[1px] bg-white/10 mx-2" />

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                { }
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            { }
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[110] bg-background/95 backdrop-blur-2xl md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-6 flex items-center justify-between border-b border-white/5">
                                <span className="text-xl md:text-2xl font-black tracking-tighter">
                                    MOVIE<span className="text-purple-500">AI</span>
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <Link
                                        to="/"
                                        onClick={() => { setIsMobileMenuOpen(false); setSearchParams({}); }}
                                        className="text-2xl font-extrabold text-white"
                                    >
                                        Home
                                    </Link>
                                    <div className="h-[1px] bg-white/5 w-full" />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <ChevronDown className="w-3 h-3" /> Explore Genres
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {genres.map((genre) => (
                                            <button
                                                key={genre.id}
                                                onClick={() => handleGenreSelect(genre)}
                                                className="text-left px-4 py-4 bg-white/5 rounded-2xl text-sm font-medium text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-all border border-white/5"
                                            >
                                                {genre.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
                                >
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;