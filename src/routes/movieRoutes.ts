import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie
} from "../controllers/movieController";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);

export default router;