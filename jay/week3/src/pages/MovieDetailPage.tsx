import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetails, Credits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage(): React.ReactElement {
  const { movieId } = useParams<{ movieId: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async (): Promise<void> => {
      if (!movieId) return;
      
      setIsLoading(true);
      setIsError(false);

      try {
        // 영화 상세 정보와 크레딧을 병렬로 가져오기
        const [movieResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&api_key=06add42a145f8a38da57f974ba1e79ec`
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR&api_key=06add42a145f8a38da57f974ba1e79ec`
          )
        ]);

        setMovieDetails(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movieDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-4">영화 정보를 불러올 수 없습니다</h2>
        <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Backdrop Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
          alt={movieDetails.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="w-80 h-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movieDetails.title}</h1>
            
            {movieDetails.tagline && (
              <p className="text-xl text-gray-300 mb-4 italic">"{movieDetails.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-xl font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">({movieDetails.vote_count}명)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-lg">{new Date(movieDetails.release_date).getFullYear()}</span>
              <span className="text-gray-300">•</span>
              <span className="text-lg">{formatRuntime(movieDetails.runtime)}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movieDetails.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">줄거리</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{movieDetails.overview}</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">제작 정보</h4>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">예산:</span> {formatCurrency(movieDetails.budget)}</p>
                  <p><span className="font-medium">수익:</span> {formatCurrency(movieDetails.revenue)}</p>
                  <p><span className="font-medium">상태:</span> {movieDetails.status}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">제작사</h4>
                <div className="space-y-1 text-gray-300">
                  {movieDetails.production_companies.map((company) => (
                    <p key={company.id}>{company.name}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast & Crew */}
        {credits && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8">출연진 & 제작진</h2>
            
            {/* Cast */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">주요 출연진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.cast.slice(0, 12).map((person) => (
                  <div key={person.credit_id} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">👤</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{person.name}</h4>
                    <p className="text-gray-400 text-xs">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">제작진</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credits.crew
                  .filter((person) => person.job === 'Director' || person.job === 'Producer' || person.job === 'Writer')
                  .slice(0, 9)
                  .map((person) => (
                    <div key={person.credit_id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">👤</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{person.name}</h4>
                        <p className="text-gray-400 text-sm">{person.job}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}