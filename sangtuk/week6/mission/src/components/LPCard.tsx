import { useNavigate } from 'react-router-dom';
import type { LP } from '../apis/apis';

interface LPCardProps {
  lp: LP;
}

// 상대 시간 계산 함수
const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export default function LPCard({ lp }: LPCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="group cursor-pointer bg-gray-900 rounded-lg overflow-hidden transition-all duration-200"
    >
      {/* 이미지 컨테이너 - 정사각형 비율 */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-800">
        {/* 이미지 */}
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
            📀
          </div>
        )}

        {/* Hover 시 나타나는 오버레이 & 메타 정보 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* 제목 */}
            <h3 className="font-bold text-white text-base mb-2 line-clamp-2">
              {lp.title}
            </h3>
            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{getRelativeTime(lp.createdAt)}</span>
              <span className="flex items-center gap-1">
                ❤️ {lp.likes?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
