import { useEffect, useState, type ReactElement } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import type {
  MovieDetails,
  CreditsResponse,
  Cast,
  Crew,
  Genre,
} from '../type/movie'; // ⭐️ 경로 수정: types -> type
import { LoadingSpinner } from '../components/LoadingSpinner';
import CastCard from '../components/CastCard';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default function MovieDetailPage(): ReactElement {
  const { movieId } = useParams<{ movieId: string }>();

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) {
        setIsError(true);
        setIsPending(false);
        return;
      }

      setIsPending(true);
      setIsError(false);

      try {
        // 1. 영화 상세 정보 요청
        const detailsPromise = axios.get<MovieDetails>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        // 2. 출연진/제작진 정보 요청
        const creditsPromise = axios.get<CreditsResponse>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        // 두 요청을 동시에 처리
        const [detailsRes, creditsRes] = await Promise.all([
          detailsPromise,
          creditsPromise,
        ]);

        setDetails(detailsRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error('Failed to fetch movie details or credits:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  // --- 로딩 및 에러 처리 ---

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 p-8">
        <p className="text-xl">
          ⚠️ 영화 정보를 불러오는 데 실패했습니다. ID를 확인해 주세요.
        </p>
      </div>
    );
  }

  // 감독과 주연 배우 6명 추출
  const director = credits?.crew.find(
    (member: Crew) => member.job === 'Director'
  );
  const leadingCast: Cast[] = credits?.cast.slice(0, 6) || [];
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
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* 백드롭 이미지 영역 */}
      <div
        className="relative h-96 bg-cover bg-center overflow-hidden shadow-2xl"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/50 to-transparent"></div>

        {/* 상세 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 flex flex-col md:flex-row items-end md:items-start space-x-6">
          <img
            src={posterUrl}
            alt={details.title}
            className="w-32 h-48 md:w-48 md:h-72 object-cover rounded-lg shadow-xl mb-4 md:mb-0 transform translate-y-1/3 md:translate-y-0 border-4 border-white/10"
          />

          <div className="flex flex-col mt-12 md:mt-0 md:pt-4 w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
              {details.title}
            </h1>

            <div className="text-sm md:text-base text-gray-300 space-x-4 mb-4">
              <span>⭐️ 평점 {rating} / 10</span>
              <span>•</span>
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{details.runtime ? `${details.runtime}분` : 'N/A'}</span>
            </div>

            <p className="text-base text-gray-200 mt-2 max-w-3xl leading-relaxed">
              {details.overview || '제공되는 줄거리가 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 포스터 하단 내용 및 출연진 */}
      <div className="p-8 mt-24 md:mt-4">
        {/* 감독 정보 */}
        {director && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3 border-b border-gray-700 pb-2">
              감독
            </h2>
            <p className="text-lg text-[#b2dab1]">{director.name}</p>
          </div>
        )}

        {/* 출연진 정보 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
            주요 출연
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {leadingCast.length > 0 ? (
              leadingCast.map((castMember: Cast) => (
                <CastCard key={castMember.id} cast={castMember} />
              ))
            ) : (
              <p className="text-gray-400">출연진 정보가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 장르 정보 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b border-gray-700 pb-2">
            장르
          </h2>
          <div className="flex flex-wrap gap-2">
            {details.genres.map((genre: Genre) => (
              <span
                key={genre.id}
                className="bg-[#dda5e3] text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
