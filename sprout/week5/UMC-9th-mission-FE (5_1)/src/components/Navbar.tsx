import type { ReactElement } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const LINKS = [
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/now_playing', label: '상영 중' },
  { to: '/movies/top_rated', label: '평점 높은' },
  { to: '/movies/upcoming', label: '개봉 예정' },
];

export const Navbar = (): ReactElement => {
  const navigate = useNavigate();

  // 임시 로그아웃 함수 (HomeLayout으로 이동)
  const handleLogout = () => {
    console.log('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 items-center">
      <NavLink
        key="home"
        to="/movies/popular"
        className="text-red-600 hover:text-red-500 font-extrabold text-xl mr-4"
      >
        🍿Movies🍿
      </NavLink>
      <div className="flex flex-1 gap-4">
        {LINKS.map(
          ({ to, label }): ReactElement => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }: { isActive: boolean }): string => {
                return isActive
                  ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1 transition duration-150'
                  : 'text-gray-400 hover:text-white transition duration-150';
              }}
            >
              {label}
            </NavLink>
          )
        )}
      </div>
      
      {/* 임시 로그아웃 버튼 추가 */}
      <button
        onClick={handleLogout}
        className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
};