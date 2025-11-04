import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movies";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  console.log(isHovered);

  return (
    <div
      onClick={() => navigate(`/movies/detail/${movie.id}`)}
      className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer w-44 transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화 이미지`}
        className="w-full h-auto object-cover"
      />

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center text-white p-4">
          <h2 className="text-lg font-bold text-center leading-snug">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}