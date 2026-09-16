import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000/api/tmdb";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const GENRES = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "18", name: "Drama" },
  { id: "14", name: "Fantasy" },
  { id: "27", name: "Horror" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
];

function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("type", type);

      if (genre) {
        params.set("genre", genre);
      }

      if (year) {
        params.set("year", year);
      }

      const response = await fetch(
        `${API}/discover?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      setMovies(data.results || []);
    } catch (err) {
      console.error("Movies error:", err);
      setError("Unable to load movies.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) {
      loadMovies();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/search?query=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      setMovies(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setType("movie");
    setGenre("");
    setYear("");

    setTimeout(() => {
      loadMovies();
    }, 0);
  }

  const years = [];

  for (let y = new Date().getFullYear(); y >= 1980; y--) {
    years.push(y);
  }

  return (
    <div className="movies-page">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          <Link to="/">YTS</Link>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/#trending">Trending</Link>
        </div>

        <form
          className="search-container"
          onSubmit={handleSearch}
        >
          <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </nav>

      {/* PAGE HEADER */}

      <section className="movies-page-header">
        <p className="section-kicker">
          MOVIE LIBRARY
        </p>

        <h1>Explore Movies & TV Series</h1>

        <p>
          Search, filter and discover movies from TMDB.
        </p>
      </section>

      {/* FILTER PANEL */}

      <section className="filter-panel">

        <div className="filter-title">
          <div>
            <p className="section-kicker">
              DISCOVER
            </p>

            <h2>Find Something to Watch</h2>
          </div>
        </div>

        <div className="filter-row">

          <div className="filter-group">
            <label>Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="movie">
                Movies
              </option>

              <option value="tv">
                TV Series
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>Genre</label>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">
                Any Year
              </option>

              {years.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="filter-button"
            onClick={loadMovies}
          >
            Apply Filters
          </button>

          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>
      </section>

      {/* RESULTS */}

      <section className="movies-section">

        <div className="section-header">
          <div>
            <p className="section-kicker">
              RESULTS
            </p>

            <h2>
              {search.trim()
                ? `Results for "${search}"`
                : type === "tv"
                ? "TV Series"
                : "Movies"}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="loading">
            Loading movies...
          </div>
        )}

        {!loading && error && (
          <div className="error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          movies.length === 0 && (
            <div className="error">
              No results found.
            </div>
          )}

        {!loading &&
          !error &&
          movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  type={type}
                />
              ))}
            </div>
          )}

      </section>

      {/* FOOTER */}

      <footer>
        <div>
          <strong>YTS.</strong>

          <p>
            A modern movie discovery experience.
          </p>
        </div>

        <p>
          Movie data provided by TMDB.
        </p>
      </footer>

    </div>
  );
}

function MovieCard({ movie, type }) {
  const title =
    movie.title ||
    movie.name ||
    "Untitled";

  const date =
    movie.release_date ||
    movie.first_air_date ||
    "";

  const year = date
    ? date.substring(0, 4)
    : "N/A";

  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card"
    >
      <div className="poster-wrapper">

        <img
          src={poster}
          alt={title}
        />

        <div className="rating">
          ⭐{" "}
          {movie.vote_average
            ? movie.vote_average.toFixed(1)
            : "N/A"}
        </div>

        <div className="movie-hover">
          <div className="movie-hover-content">

            <h3>{title}</h3>

            <div className="movie-hover-rating">
              ⭐{" "}
              {movie.vote_average
                ? movie.vote_average.toFixed(1)
                : "N/A"}
            </div>

            <p>
              {year} • HD
            </p>

            <span className="movie-hover-button">
              View Details →
            </span>

          </div>
        </div>

      </div>

      <div className="movie-info">
        <h3>{title}</h3>

        <p>
          {year} •{" "}
          {type === "tv" ? "TV" : "HD"}
        </p>
      </div>
    </Link>
  );
}

export default Movies;