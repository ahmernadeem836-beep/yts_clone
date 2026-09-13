import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import movieRoutes from "./routes/movieRoutes";

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

app.use("/api/movies", movieRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});