import { useNavigate } from 'react-router-dom';

export default function FloatingButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/create')} className="fixed right-6 bottom-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 z-50" aria-label="LP 생성">
      +
    </button>
  );
}
