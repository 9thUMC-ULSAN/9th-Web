import { useState } from 'react';
import type { Movie } from '../type/movie';
import type { JSX } from 'react'; // 💡 JSX 타입을 명시적으로 가져왔습니다.

interface MovieCardProps {
  movie: Movie;
}

// ⭐️ 오류 해결:
// 1. props를 객체 디스트럭처링 ({ movie })으로 받도록 수정했습니다.
// 2. props 타입 (MovieCardProps)과 반환 타입 (JSX.Element)을 올바르게 지정했습니다.
export default function MovieCard({ movie }: MovieCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  // src/components/MovieCard.tsx 내부 (return 부분)

  return (
    <div
      // ✅ 수정 완료: rounded-lg로 모서리를 둥글게, overflow-hidden으로 내용이 경계를 넘지 않도록 설정
      className="relative rounded-lg overflow-hidden"
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        // ✅ 수정 완료: 이미지가 아닌 부모 div가 모서리를 처리하므로 className을 비워둡니다.
        className=""
      />

      {isHovered && (
        <div
          // 호버 시 나타나는 검은색 그라데이션 div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4"
        >
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
        </div>
      )}
    </div>
  );
}
