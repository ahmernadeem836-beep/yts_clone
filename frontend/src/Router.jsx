import { Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import MovieDetails from "./MovieDetails.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default Router;