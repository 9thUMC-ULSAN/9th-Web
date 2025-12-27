import type { ReactElement } from 'react';
import type { Cast } from '../type/movie'; // ⭐️ 경로 수정: types -> type

interface CastCardProps {
  cast: Cast;
}

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w200';
const PLACEHOLDER_IMG =
  'https://placehold.co/200x300/e5e7eb/4b5563?text=No+Image';

export default function CastCard({ cast }: CastCardProps): ReactElement {
  const profileUrl = cast.profile_path
    ? `${IMG_BASE_URL}${cast.profile_path}`
    : PLACEHOLDER_IMG;

  return (
    <div className="flex flex-col items-center text-center p-3 w-32 sm:w-40 flex-shrink-0">
      <img
        src={profileUrl}
        alt={`${cast.name} Profile`}
        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-[#b2dab1] shadow-md"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
        }}
      />
      <div className="mt-3">
        <p className="text-white text-sm font-semibold truncate w-full">
          {cast.name}
        </p>
        <p className="text-gray-400 text-xs mt-1 truncate w-full">
          as {cast.character}
        </p>
      </div>
    </div>
  );
}
