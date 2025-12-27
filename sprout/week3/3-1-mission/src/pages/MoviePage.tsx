import { useEffect, useState, type JSX, type ReactElement } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../type/movie';
import MovieCard from '../components/MovieCard';

// MoviePage의 반환 타입을 Element(일반 DOM)에서 ReactElement 또는 JSX.Element로 수정했습니다.
export default function MoviePage(): ReactElement {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect((): void => {
    // ⭐️ 오류 1, 2 해결: fetchMovies 함수를 한 번만 선언하고 정의했습니다.
    const fetchMovies = async (): Promise<void> => {
      try {
        // ⭐️ try-catch 추가 (오류 처리 권장)
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              // ⭐️ 오류 3 해결: 작은따옴표(') 대신 백틱(`)을 사용했습니다.
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              // ⭐️ 오류 4 해결: 불필요한/잘못된 헤더 항목을 제거했습니다.
            },
          }
        );

        console.log(data);
        setMovies(data.results);
      } catch (error) {
        console.error('영화 데이터 로딩 실패:', error);
      }
    };

    // ⭐️ 오류 2 해결: 중복 선언/불필요한 선언 코드를 제거하고, 함수를 호출합니다.
    fetchMovies();
  }, []);

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {/* ⭐️ 오류 5, 6 해결: map 콜백에서 불필요한 타입 캐스팅을 제거했습니다. */}
      {/* movies는 항상 Movie[]이므로 조건부 렌더링을 movies.length > 0으로 대체할 수 있습니다. */}
      {movies.map(
        (movie): JSX.Element => (
          <MovieCard key={movie.id} movie={movie} />
        )
      )}
    </div>
  );
}
