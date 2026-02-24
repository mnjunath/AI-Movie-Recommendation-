import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);

app.get('/health', (req, res) => {
    res.send("backend is running successfully")
});

export default app;