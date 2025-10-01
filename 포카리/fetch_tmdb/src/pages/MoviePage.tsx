import { useEffect } from 'react';
import axios from 'axios';
const MoviePage = () => {
  useEffect((): void => {
    const fetchMovies = async () => {
      const response = await axios(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        }
      );

      console.log(response);
    };
    fetchMovies();
  }, []);
  return <div>MoviePage</div>;
};

export default MoviePage;
