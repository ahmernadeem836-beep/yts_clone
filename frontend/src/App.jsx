import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/api/tmdb";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function App() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
    fetchTrending();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/popular`);
      const data = await response.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrending() {
    try {
      const response = await fetch(`${API}/trending`);
      const data = await response.json();

      setTrending(data.results || []);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) {
      fetchMovies();
      return;
    }

    try {
      setSearching(true);

      const response = await fetch(
        `${API}/search?query=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      setMovies(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
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

    const data = await response.json();

    setSuggestions(data.results || []);
    setShowSuggestions(true);
  } catch (error) {
    console.error("Suggestions failed:", error);
  }
}

function selectSuggestion(movie) {
  setSearch(movie.title);
  setSuggestions([]);
  setShowSuggestions(false);
  setMovies([movie]);
}
async function openMovieDetails(movie) {
  try {
    setDetailsLoading(true);

    const response = await fetch(`${API}/${movie.id}`);
    const data = await response.json();

    setSelectedMovie(data);
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  } finally {
    setDetailsLoading(false);
  }
}

function closeMovieDetails() {
  setSelectedMovie(null);
}

  function scrollToMovies() {
    document
      .getElementById("movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">YTS</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#trending">Trending</a>
          <a href="#movies">Top 250</a>
        </div>
<div className="search-container">
  <form onSubmit={handleSearch}>
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={handleSearchInput}
    />
  </form>

  {showSuggestions && suggestions.length > 0 && (
    <div className="suggestions">
      {suggestions.slice(0, 5).map((movie) => (
        <div
          className="suggestion"
          key={movie.id}
          onClick={() => selectSuggestion(movie)}
        >
          {movie.poster_path ? (
            <img
              src={`${IMAGE_URL.replace("w500", "w92")}${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="suggestion-poster">🎬</div>
          )}

          <div className="suggestion-info">
            <strong>{movie.title}</strong>
            <span>
              {movie.release_date
                ? movie.release_date.substring(0, 4)
                : "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Download Movies</h1>

          <p>
            Browse thousands of movies, discover what's trending and find your
            favorite movies.
          </p>

          <button onClick={scrollToMovies}>Browse Movies</button>
        </div>
      </section>

      {/* TRENDING */}
      <section className="movies" id="trending">
        <div className="section-header">
          <h2>🔥 Trending Movies</h2>
        </div>

        <div className="movie-grid">
          {trending.slice(0, 6).map((movie) => (
            <Movie
  key={movie.id}
  movie={movie}
  onClick={openMovieDetails}
/>
          ))}
        </div>
      </section>

      {/* MOVIES */}
      <section className="movies" id="movies">
        <div className="section-header">
          <h2>
            {search.trim() ? `Search Results for "${search}"` : "Latest Movies"}
          </h2>
        </div>

        {loading || searching ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
            <Movie
  key={movie.id}
  movie={movie}
  onClick={openMovieDetails}
/>
            ))}
          </div>
        )}

        {!loading && !searching && movies.length === 0 && (
          <div className="no-results">No movies found.</div>
        )}
      
            </section>

      {detailsLoading && (
        <div className="modal-overlay">
          <div className="movie-modal">
            <div className="modal-loading">
              Loading movie details...
            </div>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div
          className="modal-overlay"
          onClick={closeMovieDetails}
        >
          <div
            className="movie-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeMovieDetails}
            >
              ×
            </button>

            <div className="modal-content">
              <div className="modal-poster">
                <img
                  src={`${IMAGE_URL}${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                />
              </div>

              <div className="modal-info">
                <h2>{selectedMovie.title}</h2>

                <div className="movie-meta">
                  <span>
                    ⭐ {selectedMovie.vote_average?.toFixed(1) || "N/A"}
                  </span>

                  <span>
                    📅 {selectedMovie.release_date || "N/A"}
                  </span>

                  <span>
                    ⏱️ {selectedMovie.runtime || "N/A"} min
                  </span>
                </div>

                <div className="genres">
                  {selectedMovie.genres?.map((genre) => (
                    <span key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>

                <h3>Overview</h3>

                <p className="overview">
                  {selectedMovie.overview || "No overview available."}
                </p>

                {selectedMovie.videos?.results?.length > 0 && (
                  <a
                    className="trailer-button"
                    href={`https://www.youtube.com/watch?v=${selectedMovie.videos.results[0].key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶ Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function Movie({ movie, onClick }) {
  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  return (
   <div
  className="movie-card"
  onClick={() => onClick(movie)}
>
      <div className="poster">
        <img src={poster} alt={movie.title} />
        <div className="movie-hover">
  <h4>{movie.title}</h4>

  <div className="movie-hover-rating">
    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
  </div>

  <div className="movie-hover-year">
    {year} • HD
  </div>

  <button
    className="movie-hover-button"
    onClick={(e) => {
      e.stopPropagation();
      onClick(movie);
    }}
  >
    View Details
  </button>
</div>

        <div className="rating">
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </div>
      </div>

      <h3>{movie.title}</h3>

      <p>
        {year} • HD
      </p>
    </div>
  );
}

export default App;