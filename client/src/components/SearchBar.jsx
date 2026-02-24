import { useState } from "react";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-surface text-white px-6 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-accent/50 transition-all font-medium placeholder-gray-600"
            />
            <button
                type="submit"
                className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition-all"
            >
                Search
            </button>
        </form>
    );
}

export default SearchBar;