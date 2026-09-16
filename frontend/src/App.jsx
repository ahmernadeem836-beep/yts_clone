import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const API = "http://localhost:3000/api/tmdb";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w92";

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

function App() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
    fetchTrending();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/popular`);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      setMovies(data.results || []);
    } catch (err) {
      console.error("Popular movies error:", err);
      setError("Unable to load movies.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrending() {
    try {
      const response = await fetch(`${API}/trending`);

      if (!response.ok) {
        throw new Error("Failed to fetch trending");
      }

      const data = await response.json();

      setTrending(data.results || []);
    } catch (err) {
      console.error("Trending error:", err);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      fetchMovies();
      return;
    }

    try {
      setSearching(true);
      setError("");
      setShowSuggestions(false);

      const response = await fetch(
        `${API}/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      setMovies(data.results || []);

      document
        .getElementById("movies")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSearchInput(e) {
    const value = e.target.value;

    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `${API}/search?query=${encodeURIComponent(value)}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setSuggestions((data.results || []).slice(0, 5));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  }

  function selectSuggestion(movie) {
    setSearch(movie.title);
    setSuggestions([]);
    setShowSuggestions(false);
    setMovies([movie]);

    document
      .getElementById("movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function applyFilters() {
    try {
      setLoading(true);
      setError("");
      setShowSuggestions(false);

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
        throw new Error("Filter request failed");
      }

      const data = await response.json();

      setMovies(data.results || []);

      document
        .getElementById("movies")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Filter error:", err);
      setError("Unable to apply filters.");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setType("movie");
    setGenre("");
    setYear("");
    setSearch("");

    fetchMovies();
  }

  function scrollToMovies() {
    document
      .getElementById("movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const years = [];

  for (let y = new Date().getFullYear(); y >= 1980; y--) {
    years.push(y);
  }

  return (
    <div className="home-page">
      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          <Link to="/">YTS</Link>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
         <Link to="/movies">Movies</Link>
          <a href="#trending">Trending</a>
          <a href="#movies">Top 250</a>
        </div>

        {/* SEARCH */}

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              className="search"
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={handleSearchInput}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((movie) => (
                <button
                  type="button"
                  className="suggestion"
                  key={movie.id}
                  onClick={() => selectSuggestion(movie)}
                >
                  {movie.poster_path ? (
                    <img
                      src={`${SMALL_IMAGE_URL}${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="suggestion-poster">
                      🎬
                    </div>
                  )}

                  <div className="suggestion-info">
                    <strong>{movie.title}</strong>

                    <span>
                      {movie.release_date
                        ? movie.release_date.substring(0, 4)
                        : "N/A"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}

      <section className="hero">
        <div className="hero-content">
          <p className="section-kicker">
            MOVIE DISCOVERY
          </p>

          <h1>
            Discover Your Next
            <br />
            Favorite Movie
          </h1>

          <p>
            Explore popular movies, discover what's trending,
            and find something great to watch.
          </p>

          <button
            onClick={scrollToMovies}
            className="hero-button"
          >
            Browse Movies
          </button>
        </div>
      </section>

      {/* FILTERS */}

      <section className="filter-section">
        <div className="filter-container">
          <div className="filter-group">
            <label>Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="movie">Movies</option>
              <option value="tv">TV Series</option>
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
              <option value="">Any Year</option>

              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="filter-button"
            onClick={applyFilters}
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

      {/* TRENDING */}

      <section
        className="movies-section"
        id="trending"
      >
        <div className="section-header">
          <div>
            <p className="section-kicker">
              TRENDING NOW
            </p>

            <h2>🔥 Trending Movies</h2>
          </div>
        </div>

        {trending.length > 0 ? (
          <div className="movie-grid">
            {trending.slice(0, 6).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="loading">
            Loading trending movies...
          </div>
        )}
      </section>

      {/* MOVIES */}

      <section
        className="movies-section"
        id="movies"
      >
        <div className="section-header">
          <div>
            <p className="section-kicker">
              {genre || year || type === "tv"
                ? "FILTERED RESULTS"
                : search.trim()
                ? "SEARCH"
                : "POPULAR"}
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

        {loading || searching ? (
          <div className="loading">
            Loading movies...
          </div>
        ) : error ? (
          <div className="error">
            {error}
          </div>
        ) : movies.length === 0 ? (
          <div className="error">
            No movies found.
          </div>
        ) : (
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

/* MOVIE CARD */

function MovieCard({ movie, type = "movie" }) {
  const title =
    movie.title || movie.name || "Untitled";

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
          {year} • {type === "tv" ? "TV" : "HD"}
        </p>
      </div>
    </Link>
  );
}

export default App;