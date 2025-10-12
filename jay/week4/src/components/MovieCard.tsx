import { useState } from 'react';
import type { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() :any | Promise<void> => navigate(`/movies/${movie.id}`)}
      className='relative rounded-2xl shadow-xl overflow-hidden cursor-pointer w-full aspect-[2/3] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 group'
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`}
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 ring-2 ring-purple-500/0 group-hover:ring-purple-500/50 rounded-2xl transition-all duration-300'></div>
      
      {/* Rating Badge */}
      <div className='absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1'>
        <span className='text-yellow-400 text-sm'>⭐</span>
        <span className='text-white text-sm font-bold'>{movie.vote_average.toFixed(1)}</span>
      </div>

      {isHovered && (
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-sm flex flex-col justify-end p-4 animate-fade-in'>
          <h2 className='text-base font-bold leading-tight mb-2 text-white'>{movie.title}</h2>
          <p className='text-xs text-gray-300 leading-relaxed line-clamp-4 mb-3'>{movie.overview}</p>
          <div className='flex items-center justify-between text-xs text-gray-400'>
            <span>📅 {new Date(movie.release_date).getFullYear()}</span>
            <span className='bg-purple-600 text-white px-2 py-1 rounded-full text-xs'>자세히 보기 →</span>
          </div>
        </div>
      )}
    </div>
  );
}
