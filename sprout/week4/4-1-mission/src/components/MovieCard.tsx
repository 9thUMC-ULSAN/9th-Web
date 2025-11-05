import { useState } from 'react';
import type { Movie } from '../types/movie';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/200x300/1f2937/FFFFFF?text=No+Poster';

  return (
    <div
      onClick={(): void | Promise<void> => navigate(`/movie/${movie.id}`)}
      className="relative rounded-xl shadow-xl overflow-hidden cursor-pointer
      transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/50 bg-gray-800"
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
    >
      {/* 포스터 이미지 */}
      <img
        src={posterUrl}
        alt={`${movie.title} 영화의 포스터`}
        className="w-full h-auto object-cover aspect-[2/3] transform transition duration-500"
      />

      {/* 호버 시 나타나는 오버레이 (간결하게 제목만 표시) */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-4 transition-opacity duration-300 opacity-100">
          <h2 className="text-xl font-bold text-center mb-2 text-red-400">
            {movie.title}
          </h2>
          <p className="text-sm font-semibold text-yellow-400">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
}
