import { useState } from 'react';
import type { Movie } from '../type/movie';
import type { JSX } from 'react'; // 💡 JSX 타입을 명시적으로 가져왔습니다.
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      // ⭐️ 수정 부분: 경로 앞에 슬래시(/)를 다시 붙여서 최상위 경로에서 시작하도록 강제합니다.
      onClick={(): void | Promise<void> => navigate(`/movie/${movie.id}`)}
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer
      w-44 transition-transform duration-500 hover:scale-105"
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
