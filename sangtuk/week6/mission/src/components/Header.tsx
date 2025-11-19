import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../hooks/useAuthToken';

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * 헤더 컴포넌트
 * 로그인/비로그인 상태에 따라 다른 UI 표시
 */
export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { hasTokens, clearTokens } = useAuthToken();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <header className="bg-black h-16 flex items-center px-6 sticky top-0 z-30 border-b border-gray-800">
      <div className="flex items-center justify-between w-full">
        {/* 좌측: 버거 메뉴 + 로고 */}
        <div className="flex items-center gap-4">
          {/* 버거 메뉴 (모바일) */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* 로고 */}
          <button
            onClick={() => navigate('/')}
            className="text-xl font-bold text-pink-500 hover:text-pink-400 transition-colors"
          >
            DOLIGO
          </button>
        </div>

        {/* 우측: 로그인 상태에 따른 버튼 */}
        <div className="flex items-center gap-3">
          {hasTokens ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block">
                환영합니다!
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
