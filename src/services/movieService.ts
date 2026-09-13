import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  MovieFilters,
  CreateMovieData,
  UpdateMovieData
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
export async function editMovie(
  id: number,
  movie: UpdateMovieData
) {
  return await updateMovie(id, movie);
}
export async function removeMovie(id: number) {
  return await deleteMovie(id);
}