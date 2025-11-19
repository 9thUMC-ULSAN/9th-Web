import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movies";
import MovieCard from "../components/Moviecard";
import { LoadingSpinner } from "../components/LoadingSpinner";

const CATEGORY_MAP: Record<string, string> = {
  popular: "popular",
  "now-playing": "now_playing",
  "top-rated": "top_rated",
  upcoming: "upcoming",
};

export default function MoviePage() {
  const { category = "popular" } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect((): void => {
    const fetchMovies = async (): Promise<void> => {
      try {
        setIsPending(true);
        setIsError(false);

        const endpoint = CATEGORY_MAP[category] || "popular";
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 버튼 */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200
                     disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
        >
          {"<"}
        </button>

        <span>{page} 페이지</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200"
        >
          {">"}
        </button>
      </div>

      {/* 로딩 또는 영화 카드 목록 */}
      {isPending ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-10 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
