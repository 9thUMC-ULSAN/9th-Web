import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth.ts';
import type { ResponseMyInfoDto } from '../types/auth.ts';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        setUserInfo(null);
        return;
      }
      try {
        const response = await getMyInfo();
        setUserInfo(response);
      } catch (error) {
        console.error('Navbar: 사용자 정보 불러오기 실패', error);
      }
    };
    fetchUserInfo();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    setUserInfo(null);
    navigate('/');
  };

  const displayName = userInfo?.data?.name;

  return (
    // [수정 포인트] z-40 -> z-50 (사이드바보다 위에 있어야 클릭 가능)
    <nav className="bg-black text-white shadow-md fixed w-full z-50 h-16 border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-white p-1 flex items-center justify-center hover:opacity-80"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="text-2xl font-bold text-pink-500 tracking-tighter hover:opacity-80 transition-opacity"
          >
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/search"
            className="text-white hover:text-pink-500 hidden sm:block"
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
                strokeWidth={3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>

          {!accessToken ? (
            <div className="flex items-center gap-4 text-sm font-bold">
              <Link to="/login" className="text-white hover:text-pink-500">
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-pink-500 rounded text-white hover:bg-pink-600"
              >
                회원가입
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden sm:inline-block">
                <span className="font-bold text-white">
                  {displayName || 'User'}
                </span>
                <span className="text-gray-300">님 반갑습니다.</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white underline-offset-4 hover:underline"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
