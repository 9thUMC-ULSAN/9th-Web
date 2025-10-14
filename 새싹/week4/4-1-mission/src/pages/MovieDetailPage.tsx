import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import type {
  MovieDetails,
  CreditsResponse,
  Cast,
  Crew,
  Genre,
} from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import CastCard from '../components/CastCard';
import useCustomFetch from '../hooks/useCustomFetch'; // Custom Hook 임포트
import ErrorDisplay from '../components/ErrorDisplay';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';
const API_BASE_URL = 'https://api.themoviedb.org/3/movie';

export default function MovieDetailPage(): ReactElement {
  const { movieId } = useParams<{ movieId: string }>();
  const moviePath = `${API_BASE_URL}/${movieId}`;

  // 1. 상세 정보 Custom Hook 호출
  const {
    data: details,
    loading: detailsLoading,
    error: detailsError,
    refetch: refetchDetails,
  } = useCustomFetch<MovieDetails>(`${moviePath}?language=ko-KR`);

  // 2. 출연진/제작진 정보 Custom Hook 호출
  const {
    data: credits,
    loading: creditsLoading,
    error: creditsError,
    refetch: refetchCredits,
  } = useCustomFetch<CreditsResponse>(`${moviePath}/credits`);

  const isLoading = detailsLoading || creditsLoading;
  const hasError = detailsError || creditsError;

  // --- 로딩 및 에러 처리 ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasError || !details) {
    // 두 에러 중 하나를 표시
    const errorMessage =
      detailsError || creditsError || '영화 정보를 찾을 수 없습니다.';
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <ErrorDisplay
          message={errorMessage}
          onRetry={detailsError ? refetchDetails : refetchCredits}
        />
      </div>
    );
  }

  // --- 데이터 추출 ---
  const director = credits?.crew.find(
    (member: Crew) => member.job === 'Director'
  );
  // 출연진은 최대 10명만 보여주도록 변경 (이미지와 유사하게)
  const leadingCast: Cast[] = credits?.cast.slice(0, 10) || [];

  const backdropUrl = details.backdrop_path
    ? `${IMG_BASE_URL}${details.backdrop_path}`
    : '';
  const posterUrl = details.poster_path
    ? `${IMG_BASE_URL}${details.poster_path}`
    : '';
  const rating = details.vote_average.toFixed(1);
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 백드롭 이미지 영역 (이미지에서 영감을 받은 디자인) */}
      <div
        className="relative h-96 lg:h-[500px] bg-cover bg-center overflow-hidden shadow-2xl"
        // 이미지가 연한 노란색 톤으로 대비되도록 오버레이 추가
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        {/* 대비를 위한 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        {/* 상세 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row items-end md:items-start space-x-6">
          {/* 포스터 이미지 */}
          <img
            src={posterUrl}
            alt={details.title}
            className="w-32 h-48 md:w-56 md:h-80 object-cover rounded-xl shadow-2xl transform translate-y-1/3 md:translate-y-0 border-4 border-gray-700/50 flex-shrink-0"
          />

          <div className="flex flex-col mt-20 md:mt-0 md:pt-4 w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-lg">
              {details.title}
            </h1>

            <div className="text-base md:text-lg text-gray-300 space-x-6 mb-4 font-light">
              <span>⭐️ {rating}</span>
              <span>•</span>
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{details.runtime ? `${details.runtime}분` : 'N/A'}</span>
            </div>

            {/* 장르 태그 (백드롭 영역에 배치) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {details.genres.map((genre: Genre) => (
                <span
                  key={genre.id}
                  className="bg-red-600/80 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-base text-gray-200 mt-2 max-w-4xl leading-relaxed bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm">
              {details.overview || '제공되는 줄거리가 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 본문 콘텐츠 (감독 및 출연진) */}
      <div className="p-6 md:p-12 mt-20 md:mt-16 mx-auto max-w-7xl">
        {/* 감독 정보 */}
        {director && (
          <div className="mb-10 p-4 border-b border-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-3 text-red-500">감독</h2>
            <p className="text-xl text-gray-300">{director.name}</p>
          </div>
        )}

        {/* 출연진 정보 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-500 border-b border-gray-800 pb-2">
            주요 출연진
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {leadingCast.length > 0 ? (
              leadingCast.map((castMember: Cast) => (
                <CastCard key={castMember.id} cast={castMember} />
              ))
            ) : (
              <p className="text-gray-400">출연진 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
