import type { Credit } from '../types/movie';

interface CastCardProps {
    cast: Credit;
}

export default function ActCard({ cast } : CastCardProps){

    return (
        <div className="flex flex-col items-center text-center">
            <img
                src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                alt={`${cast.name}영화의 이미지`}
                className="w-25 h-25 rounded-full object-cover border-gray-700 shadow-md border-2 "
            />
            <div>
                <h2 className="text-lg font-bold">{cast.name}</h2>
                <p className='text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5'>{cast.character}({cast.known_for_department})</p>
            </div>
        </div>
    );
};
