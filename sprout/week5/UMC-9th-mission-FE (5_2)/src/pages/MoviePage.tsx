import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';





import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import useCustomFetch from '../hooks/useCustomFetch';
import ErrorDisplay from '../components/ErrorDisplay';

const API_BASE_URL = 'https://api.themoviedb.org/3/movie';

// 카테고리 제목 매핑
const CATEGORY_TITLES: Record<string, string> = {
  popular: '인기 영화',
  now_playing: '상영 중',
  top_rated: '평점 높은',
  upcoming: '개봉 예정',
};

const LoadingSpinner = (): ReactElement => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-white min-h-[40vh]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
    <p className="mt-6 text-xl text-gray-300 font-medium">
      데이터를 불러오는 중...
    </p>
  </div>
);


export default function MoviePage(): ReactElement {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();
  const currentCategory = category || 'popular';
  const displayTitle = CATEGORY_TITLES[currentCategory] || currentCategory;

  const url = `${API_BASE_URL}/${currentCategory}?language=ko-KR&page=${page}`;

  const {
    data: responseData,
    loading,
    error,
    refetch,
  } = useCustomFetch<MovieResponse>(url, [page]);

  const movies = responseData?.results || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    );
  }

  const totalPages = responseData?.total_pages || 1;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      {/* 타이틀 및 카테고리 */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-6 border-b-2 border-red-700 pb-2 mx-auto max-w-7xl">
        {displayTitle}
      </h1>

      {/* 페이지네이션 UI */}
      <div className="flex items-center justify-center gap-4 mt-5 mb-8">
        <button
          className="bg-red-500 text-white w-10 h-10 rounded-full shadow-lg 
           hover:bg-red-600 transition-all duration-200 disabled:bg-gray-700 
           disabled:cursor-not-allowed text-xl font-bold"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          {'<'}
        </button>
        <span className="text-xl font-bold px-4 py-2 bg-gray-800 rounded-lg shadow-md">
          {page} / {totalPages.toLocaleString()} 페이지
        </span>
        <button
          className="bg-red-500 text-white w-10 h-10 rounded-full shadow-lg 
           hover:bg-red-600 transition-all duration-200 disabled:bg-gray-700 
           disabled:cursor-not-allowed text-xl font-bold"
          disabled={page >= totalPages || page >= 500}
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {/* 영화 카드 목록 (Grid 레이아웃) */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mx-auto max-w-7xl">
        {movies.map(
          (movie: Movie): ReactElement => (
            <MovieCard key={movie.id} movie={movie} />
          )
        )}
      </div>
    </div>
  );
}