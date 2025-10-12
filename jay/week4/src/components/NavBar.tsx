import { NavLink } from 'react-router-dom';

const LINKS = [
    { to: '/', label:'홈', icon: '🏠' },
    { to:'/movies/popular', label:'인기 영화', icon: '🔥' },
    { to:'/movies/now-playing', label:'상영 중', icon: '🎬' },
    { to:'/movies/top-rated', label:'평점 높은', icon: '⭐' },
    { to:'/movies/upcoming', label:'개봉 예정', icon: '🎭' },
];

export const Navbar = (): React.ReactElement => {
  return (
    <nav className='sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-purple-500/20 shadow-lg'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-3'>
            <span className='text-4xl'>🎥</span>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
              돌려돌려LP판
            </h1>
          </div>

          {/* Navigation Links */}
          <div className='flex gap-2'>
            {LINKS.map(({to, label, icon}): React.ReactElement => (
              <NavLink
                  key={to}
                  to={to}
                  className={({isActive}): string => {
                  return isActive 
                    ? 'flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105' 
                    : 'flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200'; 
              }}
              >
                  <span>{icon}</span>
                  <span className='hidden md:inline'>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* 로그인/회원가입 버튼 */}
          <div className='flex gap-2'>
            <NavLink
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              로그인
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              회원가입
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
