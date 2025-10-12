import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
interface MoviePageProps {
  category: string;
}

export default function MoviePage({ category }: MoviePageProps): React.ReactElement {
  const [movies, setMovies] = useState<Movie[]>([]);
  // 1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 2. 에러 상태
  const [isError, setError] = useState(false);
  // 3. 페이지
  const [page, setPage] = useState(1);

  useEffect((): void => {
    console.log('Fetching movies for category:', category);
    const fetchMovies = async (): Promise<void> => {
      setIsPending(true);

      try {
        // Map category to endpoint
        const url = (() => {
          if (category === 'trending_day') {
            return `https://api.themoviedb.org/3/trending/movie/day?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
          }
          if (category === 'trending_week') {
            return `https://api.themoviedb.org/3/trending/movie/week?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
          }
          return `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
        })();

        const { data } = await axios.get<MovieResponse>(url);
        console.log('Movies fetched:', data.results.length);
        setMovies(data.results);
        setIsPending(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchMovies();
  }, [page, category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">Error</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
             hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
             cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
             hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {">"}
        </button>
      </div>
      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}
      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map(
            (movie): React.ReactElement => (
              <MovieCard key={movie.id} movie={movie} />
            )
          )}
        </div>
      )}
    </>
  );
}
