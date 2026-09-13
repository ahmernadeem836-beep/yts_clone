import { Request, Response } from "express";

import {
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  getMovieDetails,
  discoverMovies,
} from "../services/tmdbService";

export async function popularMovies(
  req: Request,
  res: Response
) {
  try {
    const page = Number(req.query.page) || 1;

    const data = await getPopularMovies(page);

    res.json(data);
  } catch (error) {
    console.error("Popular movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch popular movies",
    });
  }
}

export async function trendingMovies(
  req: Request,
  res: Response
) {
  try {
    const data = await getTrendingMovies();

    res.json(data);
  } catch (error) {
    console.error("Trending movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
    });
  }
}

export async function movieSearch(
  req: Request,
  res: Response
) {
  try {
    const query = String(req.query.query || "");
    const page = Number(req.query.page) || 1;

    if (!query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const data = await searchMovies(query, page);

    res.json(data);
  } catch (error) {
    console.error("Movie search error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search movies",
    });
  }
}

export async function movieDetails(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID",
      });
    }

    const data = await getMovieDetails(id);

    res.json(data);
  } catch (error) {
    console.error("Movie details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details",
    });
  }
}

export async function discover(
  req: Request,
  res: Response
) {
  try {
    const genre = req.query.genre
      ? String(req.query.genre)
      : undefined;

    const page = Number(req.query.page) || 1;

    const data = await discoverMovies(genre, page);

    res.json(data);
  } catch (error) {
    console.error("Discover movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to discover movies",
    });
  }
}