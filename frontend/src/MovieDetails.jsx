import "./MovieDetails.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API = "http://localhost:3000/api/tmdb";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  async function fetchMovie() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/${id}`);
      const data = await response.json();

      setMovie(data);

      // Similar movies will come from backend
      if (data.similar?.results) {
        setSimilarMovies(data.similar.results);
      } else {
        setSimilarMovies([]);
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          Loading movie details...
        </div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="details-page">
        <div className="details-error">
          <h2>Movie not found</h2>

          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer"
  );

  return (
    <div className="details-page">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          <Link to="/">YTS</Link>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#movies">Movies</Link>
          <Link to="/#trending">Trending</Link>
        </div>
      </nav>

      {/* MOVIE HERO */}

      <section
        className="movie-detail-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(
                90deg,
                rgba(8, 9, 10, 0.98) 0%,
                rgba(8, 9, 10, 0.88) 45%,
                rgba(8, 9, 10, 0.55) 100%
              ),
              url(${BACKDROP_URL}${movie.backdrop_path})`
            : "linear-gradient(90deg, #111, #222)",
        }}
      >
        <div className="detail-container">

          <Link to="/" className="back-button">
            ← Back to Movies
          </Link>

          <div className="movie-detail-content">

            {/* POSTER */}

            <div className="detail-poster">
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-detail-poster">
                  No Poster
                </div>
              )}
            </div>

            {/* INFORMATION */}

            <div className="detail-info">

              <p className="section-kicker">
                MOVIE DETAILS
              </p>

              <h1>{movie.title}</h1>

              {movie.tagline && (
                <p className="tagline">
                  {movie.tagline}
                </p>
              )}

              <div className="detail-meta">
                <span className="detail-rating">
                  ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                </span>

                <span>
                  📅 {movie.release_date || "N/A"}
                </span>

                <span>
                  ⏱️ {movie.runtime || "N/A"} min
                </span>
              </div>

              {movie.genres?.length > 0 && (
                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <h3>Overview</h3>

              <p className="detail-overview">
                {movie.overview ||
                  "No overview available."}
              </p>

              {trailer && (
                <a
                  className="trailer-button"
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR MOVIES */}

      {similarMovies.length > 0 && (
        <section className="similar-section">

          <div className="section-header">
            <p className="section-kicker">
              YOU MAY ALSO LIKE
            </p>

            <h2>Similar Movies</h2>
          </div>

          <div className="movie-grid">
            {similarMovies.slice(0, 6).map((similar) => (
              <Link
                key={similar.id}
                to={`/movie/${similar.id}`}
                className="similar-card"
              >
                <div className="poster-wrapper">

                  {similar.poster_path ? (
                    <img
                      src={`${IMAGE_URL}${similar.poster_path}`}
                      alt={similar.title}
                    />
                  ) : (
                    <div className="no-poster">
                      No Poster
                    </div>
                  )}

                  <div className="rating">
                    ⭐{" "}
                    {similar.vote_average
                      ? similar.vote_average.toFixed(1)
                      : "N/A"}
                  </div>
                </div>

                <div className="movie-info">
                  <h3>{similar.title}</h3>

                  <p>
                    {similar.release_date
                      ? similar.release_date.substring(0, 4)
                      : "N/A"}
                    {" • "}
                    HD
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </section>
      )}

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

export default MovieDetails;