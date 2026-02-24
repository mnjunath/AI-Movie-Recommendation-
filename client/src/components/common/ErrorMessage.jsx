import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-background">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-dark p-12 rounded-3xl flex flex-col items-center max-w-md text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    {message || "We encountered an error while trying to load the content. Please try again."}
                </p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default ErrorMessage;
