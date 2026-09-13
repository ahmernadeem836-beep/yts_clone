import { queryDB } from "../config/db";

export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: number;
  sort?: "rating" | "year" | "latest";
  page?: number;
  limit?: number;
}

export async function getAllMovies(filters: MovieFilters = {}) {
  const {
    search,
    genre,
    year,
    sort = "latest",
    page = 1,
    limit = 10
  } = filters;

  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1 = 1";

  if (search) {
    whereClause += `
      AND m.title LIKE '%${search.replace(/'/g, "''")}%'
    `;
  }

  if (year) {
    whereClause += `
      AND m.release_year = ${year}
    `;
  }

  if (genre) {
    whereClause += `
      AND EXISTS (
        SELECT 1
        FROM movie_genres mg2
        INNER JOIN genres g2
          ON g2.id = mg2.genre_id
        WHERE mg2.movie_id = m.id
          AND g2.name = '${genre.replace(/'/g, "''")}'
      )
    `;
  }

  let orderBy = "m.created_at DESC";

  if (sort === "rating") {
    orderBy = "m.rating DESC";
  } else if (sort === "year") {
    orderBy = "m.release_year DESC";
  }

  const query = `
    SELECT
      m.id,
      m.title,
      m.description,
      m.release_year,
      m.rating,
      m.runtime,
      m.poster_url,
      m.backdrop_url,
      m.trailer_url,
      STRING_AGG(g.name, ', ') AS genres
    FROM movies m
    LEFT JOIN movie_genres mg
      ON m.id = mg.movie_id
    LEFT JOIN genres g
      ON g.id = mg.genre_id

    ${whereClause}

    GROUP BY
      m.id,
      m.title,
      m.description,
      m.release_year,
      m.rating,
      m.runtime,
      m.poster_url,
      m.backdrop_url,
      m.trailer_url,
      m.created_at

    ORDER BY ${orderBy}

    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY;
  `;

  return queryDB(query);
}

export async function getMovieById(id: number) {
  const query = `
    SELECT
      m.id,
      m.title,
      m.description,
      m.release_year,
      m.rating,
      m.runtime,
      m.poster_url,
      m.backdrop_url,
      m.trailer_url,
      STRING_AGG(g.name, ', ') AS genres
    FROM movies m
    LEFT JOIN movie_genres mg
      ON m.id = mg.movie_id
    LEFT JOIN genres g
      ON g.id = mg.genre_id
    WHERE m.id = ${id}

    GROUP BY
      m.id,
      m.title,
      m.description,
      m.release_year,
      m.rating,
      m.runtime,
      m.poster_url,
      m.backdrop_url,
      m.trailer_url,
      m.created_at;
  `;

  const movies = await queryDB(query);

  return movies[0] ?? null;
}
export interface CreateMovieData {
  title: string;
  description?: string;
  release_year?: number;
  rating?: number;
  runtime?: number;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
  genre_ids?: number[];
}

export async function createMovie(movie: CreateMovieData) {
  const {
    title,
    description,
    release_year,
    rating,
    runtime,
    poster_url,
    backdrop_url,
    trailer_url,
    genre_ids = []
  } = movie;

  const escapeSql = (value: string) =>
    value.replace(/'/g, "''");

  const movieQuery = `
    INSERT INTO movies (
      title,
      description,
      release_year,
      rating,
      runtime,
      poster_url,
      backdrop_url,
      trailer_url
    )
    OUTPUT INSERTED.id
    VALUES (
      '${escapeSql(title)}',
      ${description ? `'${escapeSql(description)}'` : "NULL"},
      ${release_year ?? "NULL"},
      ${rating ?? 0},
      ${runtime ?? "NULL"},
      ${poster_url ? `'${escapeSql(poster_url)}'` : "NULL"},
      ${backdrop_url ? `'${escapeSql(backdrop_url)}'` : "NULL"},
      ${trailer_url ? `'${escapeSql(trailer_url)}'` : "NULL"}
    );
  `;

  const result = await queryDB(movieQuery);
  const movieId = result[0].id;

  for (const genreId of genre_ids) {
    const genreQuery = `
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES (${movieId}, ${genreId});
    `;

    await queryDB(genreQuery);
  }

  return movieId;
}
export interface UpdateMovieData {
  title?: string;
  description?: string;
  release_year?: number;
  rating?: number;
  runtime?: number;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
}

export async function updateMovie(
  id: number,
  movie: UpdateMovieData
) {
  const fields: string[] = [];

  const escapeSql = (value: string) =>
    value.replace(/'/g, "''");

  if (movie.title !== undefined) {
    fields.push(`title = '${escapeSql(movie.title)}'`);
  }

  if (movie.description !== undefined) {
    fields.push(`description = '${escapeSql(movie.description)}'`);
  }

  if (movie.release_year !== undefined) {
    fields.push(`release_year = ${movie.release_year}`);
  }

  if (movie.rating !== undefined) {
    fields.push(`rating = ${movie.rating}`);
  }

  if (movie.runtime !== undefined) {
    fields.push(`runtime = ${movie.runtime}`);
  }

  if (movie.poster_url !== undefined) {
    fields.push(`poster_url = '${escapeSql(movie.poster_url)}'`);
  }

  if (movie.backdrop_url !== undefined) {
    fields.push(`backdrop_url = '${escapeSql(movie.backdrop_url)}'`);
  }

  if (movie.trailer_url !== undefined) {
    fields.push(`trailer_url = '${escapeSql(movie.trailer_url)}'`);
  }

  if (fields.length === 0) {
    return false;
  }

  fields.push("updated_at = GETDATE()");

  const query = `
    UPDATE movies
    SET ${fields.join(", ")}
    WHERE id = ${id};
  `;

  await queryDB(query);

  return true;
}
export async function deleteMovie(id: number) {
  const query = `
    DELETE FROM movies
    WHERE id = ${id};
  `;

  await queryDB(query);

  return true;
}