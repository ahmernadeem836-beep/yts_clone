const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function tmdbRequest(endpoint: string) {
  const token = process.env.TMDB_TOKEN;

  if (!token) {
    throw new Error("TMDB_TOKEN is missing from .env");
  }

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getPopularMovies(page = 1) {
  return tmdbRequest(
    `/movie/popular?language=en-US&page=${page}`
  );
}

export async function getTrendingMovies() {
  return tmdbRequest(
    `/trending/movie/week?language=en-US`
  );
}

export async function searchMovies(query: string, page = 1) {
  return tmdbRequest(
    `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`
  );
}

export async function getMovieDetails(id: number) {
  return tmdbRequest(
    `/movie/${id}?language=en-US&append_to_response=videos,credits`
  );
}

export async function discoverMovies(
  genre?: string,
  page = 1
) {
  let endpoint =
    `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;

  if (genre) {
    endpoint += `&with_genres=${encodeURIComponent(genre)}`;
  }

  return tmdbRequest(endpoint);
}