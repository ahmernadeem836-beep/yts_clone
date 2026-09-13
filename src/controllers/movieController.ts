import { Request, Response } from "express";
import {
  getMovies,
  getMovie,
  addMovie,
  editMovie,
  removeMovie
} from "../services/movieService";

export async function getAllMovies(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined;
    const genre = req.query.genre as string | undefined;

    const year = req.query.year
      ? Number(req.query.year)
      : undefined;

    const sort = req.query.sort as
      | "rating"
      | "year"
      | "latest"
      | undefined;

    const page = req.query.page
      ? Number(req.query.page)
      : 1;

    const limit = req.query.limit
      ? Number(req.query.limit)
      : 10;

    if (year !== undefined && isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year"
      });
    }

    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page"
      });
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50"
      });
    }

    const movies = await getMovies({
      search,
      genre,
      year,
      sort,
      page,
      limit
    });

    res.status(200).json({
      success: true,
      page,
      limit,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error("Get movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies"
    });
  }
}

export async function getMovieById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const movie = await getMovie(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error("Get movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie"
    });
  }
}
export async function createMovie(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      description,
      release_year,
      rating,
      runtime,
      poster_url,
      backdrop_url,
      trailer_url,
      genre_ids
    } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    if (rating !== undefined && (rating < 0 || rating > 10)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 10"
      });
    }

    const movieId = await addMovie({
      title,
      description,
      release_year,
      rating,
      runtime,
      poster_url,
      backdrop_url,
      trailer_url,
      genre_ids
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie_id: movieId
    });
  } catch (error) {
    console.error("Create movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create movie"
    });
  }
}
export async function updateMovie(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const movie = await getMovie(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    const updated = await editMovie(id, req.body);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update"
      });
    }

    const updatedMovie = await getMovie(id);

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie
    });
  } catch (error) {
    console.error("Update movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update movie"
    });
  }
}
export async function deleteMovie(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const movie = await getMovie(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    await removeMovie(id);

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error) {
    console.error("Delete movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete movie"
    });
  }
}