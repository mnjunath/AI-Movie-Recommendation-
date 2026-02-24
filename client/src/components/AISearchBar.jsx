import { useState } from "react";

function AISearchBar({ onAISearch }) {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAISearch(prompt);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative flex items-center bg-surface rounded-2xl border border-white/5 overflow-hidden">
                <input
                    type="text"
                    placeholder="Ask AI recommendations..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow bg-transparent text-white px-4 md:px-8 py-3 md:py-4 focus:outline-none placeholder-gray-600 font-medium text-sm md:text-base"
                />
                <button
                    type="submit"
                    className="bg-white text-black hover:bg-gray-200 px-4 md:px-10 py-3 md:py-4 font-bold transition-all flex items-center gap-2 md:gap-3 whitespace-nowrap text-sm md:text-base"
                >
                    <span className="text-purple-600 animate-bounce">✨</span>
                    <span>AI <span className="hidden sm:inline">Recommended</span></span>
                </button>
            </div>
        </form>
    );
}

export default AISearchBar;