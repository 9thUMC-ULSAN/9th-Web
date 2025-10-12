import { useParams } from "react-router-dom";
import type { MovieDetails, Credits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage(): React.ReactElement {
  const { movieId } = useParams<{ movieId: string }>();

  // Custom Hook 사용 - 영화 상세 정보
  const { data: movieDetails, isLoading: isLoadingDetails, error: detailsError } = 
    useCustomFetch<MovieDetails>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&api_key=06add42a145f8a38da57f974ba1e79ec` : null
    );

  // Custom Hook 사용 - 크레딧 정보
  const { data: credits, isLoading: isLoadingCredits, error: creditsError } = 
    useCustomFetch<Credits>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR&api_key=06add42a145f8a38da57f974ba1e79ec` : null
    );

  const isLoading = isLoadingDetails || isLoadingCredits;
  const error = detailsError || creditsError;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <LoadingSpinner />
        <p className="text-white mt-6 text-xl animate-pulse">영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-900/20 to-gray-900">
        <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">😢</span>
            <h2 className="text-2xl font-bold text-red-400">영화 정보를 불러올 수 없습니다</h2>
          </div>
          <p className="text-gray-300 mb-6">{error || '잠시 후 다시 시도해주세요.'}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            돌아가기
          </button>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Backdrop Image */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
          alt={movieDetails.title}
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/80" />
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="relative group">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                className="w-full h-auto rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/50"
              />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300"></div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 backdrop-blur-sm bg-gray-900/50 rounded-2xl p-8 shadow-xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {movieDetails.title}
            </h1>
            
            {movieDetails.tagline && (
              <p className="text-xl text-gray-300 mb-6 italic border-l-4 border-purple-500 pl-4">
                "{movieDetails.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-3xl">⭐</span>
                <div>
                  <span className="text-2xl font-bold text-yellow-400">{movieDetails.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm ml-2">({movieDetails.vote_count.toLocaleString()}명)</span>
                </div>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <span className="text-lg font-semibold">{new Date(movieDetails.release_date).getFullYear()}</span>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-lg font-semibold">{formatRuntime(movieDetails.runtime)}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-3 mb-8">
              {movieDetails.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg transform transition-all hover:scale-110 hover:shadow-purple-500/50"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span>
                줄거리
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                {movieDetails.overview}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  제작 정보
                </h4>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-400">예산:</span>
                    <span className="text-white">{formatCurrency(movieDetails.budget)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-400">수익:</span>
                    <span className="text-white">{formatCurrency(movieDetails.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-400">상태:</span>
                    <span className="text-white">{movieDetails.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🎬</span>
                  제작사
                </h4>
                <div className="space-y-2 text-gray-300">
                  {movieDetails.production_companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center gap-2">
                      <span className="text-purple-400">•</span>
                      <p className="text-white">{company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast & Crew */}
        {credits && (
          <div className="mt-16 pb-12">
            <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
              <span className="text-3xl">🎭</span>
              출연진 & 제작진
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-12"></div>
            
            {/* Cast */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                주요 출연진
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {credits.cast.slice(0, 12).map((person) => (
                  <div 
                    key={person.credit_id} 
                    className="group text-center transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all shadow-lg">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <span className="text-white text-4xl">👤</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h4 className="font-bold text-sm mb-1 text-white">{person.name}</h4>
                    <p className="text-gray-400 text-xs bg-white/5 px-2 py-1 rounded-full inline-block">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew */}
            <div>
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="text-2xl">🎥</span>
                제작진
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credits.crew
                  .filter((person) => person.job === 'Director' || person.job === 'Producer' || person.job === 'Writer')
                  .slice(0, 9)
                  .map((person) => (
                    <div 
                      key={person.credit_id} 
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/30">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <span className="text-white text-2xl">👤</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{person.name}</h4>
                        <p className="text-purple-400 text-sm font-semibold">{person.job}</p>
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