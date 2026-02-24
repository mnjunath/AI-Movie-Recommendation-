import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Film } from "lucide-react";

function Login({ onLogin }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(form);
            onLogin(data.token);
            navigate("/");
        } catch (error) {
            setError(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-background">
            {}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-purple-900/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000"
                    alt=""
                    className="w-full h-full object-cover blur-sm opacity-40 scale-105"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 w-full max-w-md"
            >
                <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-3xl">
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6 shadow-purple-500/20"
                        >
                            <Film className="text-white w-10 h-10" />
                        </motion.div>
                        <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 font-medium">Step into your personal cinema</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 focus:border-accent/40 rounded-2xl outline-none text-white transition-all placeholder-gray-600 font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 focus:border-accent/40 rounded-2xl outline-none text-white transition-all placeholder-gray-600 font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 group-hover:scale-105" />
                            <div className="relative flex items-center justify-center gap-3 bg-accent hover:bg-transparent text-white p-5 rounded-2xl font-bold transition-all shadow-xl shadow-accent/20">
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        <span>Sign In to Continue</span>
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 font-medium">
                            New to MovieAI?{" "}
                            <Link to="/register" className="text-accent hover:text-accent-light font-bold transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login;