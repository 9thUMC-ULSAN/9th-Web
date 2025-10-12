import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import Layout from "./components/Layout";

function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MoviePage category="popular" />} />
          <Route path="movies/popular" element={<MoviePage category="popular" />} />
          <Route path="movies/now-playing" element={<MoviePage category="now_playing" />} />
          <Route path="movies/top-rated" element={<MoviePage category="top_rated" />} />
          <Route path="movies/upcoming" element={<MoviePage category="upcoming" />} />
          <Route path="trending/day" element={<MoviePage category="trending_day" />} />
          <Route path="trending/week" element={<MoviePage category="trending_week" />} />
          <Route path="movies/:movieId" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
