import { Router } from "express";

import {
  popularMovies,
  trendingMovies,
  movieSearch,
  movieDetails,
  discover,
} from "../controllers/tmdbController";

const router = Router();

router.get("/popular", popularMovies);
router.get("/trending", trendingMovies);
router.get("/search", movieSearch);
router.get("/discover", discover);
router.get("/:id", movieDetails);

export default router;