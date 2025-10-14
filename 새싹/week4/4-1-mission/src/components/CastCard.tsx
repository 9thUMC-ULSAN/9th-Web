import type { ReactElement } from 'react';
import type { Cast } from '../types/movie';

interface CastCardProps {
  cast: Cast;
}

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w200';
const PLACEHOLDER_IMG =
  'https://placehold.co/128x128/374151/D1D5DB?text=No+Image';

export default function CastCard({ cast }: CastCardProps): ReactElement {
  const profileUrl = cast.profile_path
    ? `${IMG_BASE_URL}${cast.profile_path}`
    : PLACEHOLDER_IMG;

  return (
    <div className="flex flex-col items-center text-center p-3 w-28 sm:w-32 flex-shrink-0 bg-gray-800 rounded-xl shadow-lg hover:shadow-red-500/50 transition duration-300">
      <img
        src={profileUrl}
        alt={`${cast.name} Profile`}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-2 border-red-500 shadow-md"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
        }}
      />
      <div className="mt-3 w-full">
        <p className="text-white text-sm font-semibold truncate w-full">
          {cast.name}
        </p>
        <p className="text-red-400 text-xs mt-1 truncate w-full">
          {cast.character || 'N/A'}
        </p>
      </div>
    </div>
  );
}
