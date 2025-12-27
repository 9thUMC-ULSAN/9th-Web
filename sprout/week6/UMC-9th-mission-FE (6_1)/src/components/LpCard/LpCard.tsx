import { useNavigate } from 'react-router-dom';
import type { Lp } from '../../types/lp';

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // [핵심] 상세페이지로 갈 때, 현재 카드의 모든 정보(...lp)를 싸서 보냅니다.
    navigate(`/lp/${lp.id}`, {
      state: { ...lp },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer h-64 w-full bg-gray-900"
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail || 'https://placehold.co/400x400?text=No+Image'}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{lp.title}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-snug">
          {lp.content || '내용이 없습니다.'}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            {lp.createdAt
              ? new Date(lp.createdAt).toLocaleDateString()
              : 'Just now'}
          </span>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{lp.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
