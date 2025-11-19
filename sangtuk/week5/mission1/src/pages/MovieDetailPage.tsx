import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
}

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setIsPending(true);
        setIsError(false);

        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="relative min-h-screen bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />

      <div className="relative p-10 flex gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-80 rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">{movie.title}</h1>
          <p className="text-white mb-2 drop-shadow-md">평점: {movie.vote_average.toFixed(1)}</p>
          <p className="text-white mb-2 drop-shadow-md">개봉일: {movie.release_date}</p>
          <p className="text-white mb-2 drop-shadow-md">러닝타임: {movie.runtime}분</p>

          <div className="flex gap-2 mb-4">
            {movie.genres.map(genre => (
              <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-lg leading-relaxed text-white drop-shadow-md">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
