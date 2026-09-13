import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import movieRoutes from "./routes/movieRoutes";
import tmdbRoutes from "./routes/tmdbRoutes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "YTS Clone API is running"
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is healthy"
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/tmdb", tmdbRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});