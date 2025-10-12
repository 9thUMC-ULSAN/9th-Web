import { useMemo, useState } from "react";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

interface MoviePageProps {
  category: string;
}

export default function MoviePage({ category }: MoviePageProps): React.ReactElement {
  const [page, setPage] = useState(1);

  // URL을 동적으로 생성 (category와 page가 변경될 때마다 자동 재요청)
  const url = useMemo(() => {
    if (category === 'trending_day') {
      return `https://api.themoviedb.org/3/trending/movie/day?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
    }
    if (category === 'trending_week') {
      return `https://api.themoviedb.org/3/trending/movie/week?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
    }
    return `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}&api_key=06add42a145f8a38da57f974ba1e79ec`;
  }, [category, page]);

  // Custom Hook 사용
  const { data, isLoading, error } = useCustomFetch<MovieResponse>(url);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900/20 to-gray-900">
        <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-2xl font-bold text-red-400">오류가 발생했습니다</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {category === 'trending_day' && '오늘의 트렌드'}
            {category === 'trending_week' && '이번 주 트렌드'}
            {category === 'popular' && '인기 영화'}
            {category === 'now_playing' && '현재 상영중'}
            {category === 'top_rated' && '최고 평점'}
            {category === 'upcoming' && '개봉 예정'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* 페이지네이션 컨트롤 */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-lg
               hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:from-gray-600 disabled:to-gray-600
               disabled:cursor-not-allowed font-semibold transform hover:scale-105 active:scale-95"
            disabled={page === 1 || isLoading}
            onClick={(): void => setPage((prev): number => prev - 1)}
          >
            ← 이전
          </button>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-white font-semibold text-lg">{page} 페이지</span>
          </div>
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full shadow-lg
               hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold
               transform hover:scale-105 active:scale-95 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading}
            onClick={(): void => setPage((prev): number => prev + 1)}
          >
            다음 →
          </button>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-96">
            <LoadingSpinner />
            <p className="text-white mt-6 text-lg animate-pulse">영화를 불러오는 중...</p>
          </div>
        )}

        {/* 영화 그리드 */}
        {!isLoading && data && (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.results.map(
              (movie): React.ReactElement => (
                <MovieCard key={movie.id} movie={movie} />
              )
            )}
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {!isLoading && data && data.results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <span className="text-6xl mb-4">🎬</span>
            <p className="text-white text-xl">영화를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
