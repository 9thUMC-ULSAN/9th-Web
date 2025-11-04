import './App.css'
import MoviePage from "./pages/moviepage";

function App() {
  console.log(import.meta.env.VITE_TMBD_KEY);
  return (
    <>
      <MoviePage />
    </>
  );
}

export default App;
