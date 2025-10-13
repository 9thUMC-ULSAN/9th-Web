import { useEffect, useState, type ReactElement } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../type/movie';
import MovieCard from '../components/MovieCard';
import { useParams } from 'react-router-dom';

const LoadingSpinner = (): ReactElement => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    <p className="mt-4 text-gray-700">로딩 중...</p>
  </div>
);
// 🚨 (임시 정의 끝)

export default function MoviePage(): ReactElement {
  // 1. 영화 목록 상태 추가 (가장 큰 오류의 원인)
  const [movies, setMovies] = useState<Movie[]>([]);
  // 2. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 3. 에러 상태 (선언되었으나 사용되지 않음 경고는 유지되지만, 에러 처리를 위해 남겨둡니다)
  const [isError, setIsError] = useState(false);
  // 4. 페이지
  const [page, setPage] = useState(1);

  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      setIsPending(true);
      setIsError(false); // 새로운 요청 시 에러 상태 초기화

      try {
        const { data } = await axios.get<MovieResponse>(
          // 템플릿 리터럴(`...${page}`)이 끊어져 있던 것을 수정했습니다.
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              // 환경 변수 사용 시 백틱 안에 넣지 않도록 주의합니다.
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(data.results);
      } catch (error) {
        // 오류가 발생하면 콘솔에 로그를 남기고, 에러 상태를 true로 설정합니다.
        console.error('Failed to fetch movies:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]); // page가 변경될 때마다 재실행

  // 에러 발생 시 처리
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // JSX 반환 부분
  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5 p-4">
        {' '}
        {/* jutifu-center 오타 수정 */}
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >
          {'<'}
        </button>
        <span className="text-xl font-bold">{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={(): void => setPage((prev): number => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {/* 로딩 중일 때와 데이터 표시 부분을 하나의 조건문으로 처리하여 중복을 제거합니다. */}
      {isPending ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map(
            (
              movie
            ): ReactElement => ( // 암시적 'any' 타입 문제를 해결하기 위해 ReactElement 사용
              <MovieCard key={movie.id} movie={movie} />
            )
          )}
        </div>
      )}
    </>
  );
}
