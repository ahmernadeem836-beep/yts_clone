import {
  getAllMovies,
  getMovieById,
  createMovie,
  MovieFilters,
  CreateMovieData
} from "../repositories/movieRepository";

export async function getMovies(filters: MovieFilters = {}) {
  return await getAllMovies(filters);
}

export async function getMovie(id: number) {
  return await getMovieById(id);
}

export async function addMovie(movie: CreateMovieData) {
  return await createMovie(movie);
}