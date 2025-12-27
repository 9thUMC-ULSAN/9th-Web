import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import type { MovieResponse, Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import useCustomFetch from '../hooks/useCustomFetch';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const API_BASE_URL = 'https://api.themoviedb.org/3/movie';

// 카테고리 제목 매핑
const CATEGORY_TITLES: Record<string, string> = {
  popular: '인기 영화',
  now_playing: '상영 중',
  top_rated: '평점 높은',
  upcoming: '개봉 예정',
};

export default function MoviePage(): ReactElement {
  // 1. 상태 관리는 페이지네이션에 필요한 page만 남깁니다.
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();
  const currentCategory = category || 'popular';
  const displayTitle = CATEGORY_TITLES[currentCategory] || currentCategory;

  // 2. Custom Hook 사용: URL과 page를 의존성으로 전달
  const url = `${API_BASE_URL}/${currentCategory}?language=ko-KR&page=${page}`;

  // MovieResponse 타입으로 데이터를 가져오며, page를 params 배열에 넣어 의존성을 관리합니다.
  const {
    data: responseData,
    loading,
    error,
    refetch,
  } = useCustomFetch<MovieResponse>(url, [page]);

  const movies = responseData?.results || [];

  // 3. 로딩 및 에러 처리 (Custom Hook이 제공하는 상태 활용)
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

      {/* 페이지네이션 UI (상단 이미지와 유사하게 중앙 배치) */}
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
          // 임시로 최대 페이지를 500으로 제한 (TMDB API의 페이지 제한)
          disabled={page >= totalPages || page >= 500}
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {/* 영화 카드 목록 (Grid 레이아웃) */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mx-auto max-w-7xl">
        {movies.map(
          (
            movie: Movie
          ): ReactElement => ( // 💡 movie에 Movie 타입 명시 (ts(7006) 해결)
            <MovieCard key={movie.id} movie={movie} />
          )
        )}
      </div>
    </div>
  );
}
