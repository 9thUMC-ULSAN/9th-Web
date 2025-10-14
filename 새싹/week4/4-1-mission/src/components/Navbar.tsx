import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/now_playing', label: '상영 중' },
  { to: '/movies/top_rated', label: '평점 높은' },
  { to: '/movies/upcoming', label: '개봉 예정' },
];

export const Navbar = (): ReactElement => {
  return (
    // 배경색을 다크 모드로 설정하여 일관성을 높입니다.
    <div className="flex gap-4 p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
      <NavLink
        key="home"
        to="/"
        className="text-red-500 hover:text-red-400 font-extrabold text-xl mr-4"
      >
        😺 Movies
      </NavLink>
      {LINKS.map(
        ({ to, label }): ReactElement => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }: { isActive: boolean }): string => {
              // 💡 isActive 타입 명시 (ts(7031) 해결)
              // NavLink 색상을 다크 모드에 맞게 변경하고, 활성화 시 빨간색 강조
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
  );
};
