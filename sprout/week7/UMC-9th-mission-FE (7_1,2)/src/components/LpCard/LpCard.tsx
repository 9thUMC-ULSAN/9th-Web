import { useNavigate } from 'react-router-dom';
import type { Lp } from '../../types/lp';

interface LpCardProps {
  lp: Lp;
}

const formatTimeAgo = (dateValue: string | Date) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // ✅ App.tsx 설정에 맞춰 /lps/ 로 수정 (s 추가)
    navigate(`/lps/${lp.id}`, {
      state: { ...lp },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-lg overflow-hidden cursor-pointer h-64 w-full bg-gray-900 transition-all duration-300 transform hover:scale-[1.10] hover:shadow-2xl hover:shadow-pink-700/50 hover:z-50"
    >
      <img
        src={lp.thumbnail || 'https://placehold.co/400x400?text=No+Image'}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 z-0"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{lp.title}</h3>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{lp.createdAt ? formatTimeAgo(lp.createdAt) : 'Just now'}</span>
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
