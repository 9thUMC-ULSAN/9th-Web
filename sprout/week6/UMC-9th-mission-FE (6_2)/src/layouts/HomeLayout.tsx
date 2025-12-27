import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';

const HomeLayout = () => {
  const navigate = useNavigate();

  // 1. 초기 상태: PC(1024px 이상)면 열림, 모바일이면 닫힘
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // 2. 리사이즈 감지
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
      {/* 1. Navbar (z-50) */}
      <div className="relative z-50">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* 2. 메인 콘텐츠 */}
      <div className="flex flex-1 pt-16 h-full relative">
        <main className="flex-1 overflow-y-auto bg-black relative w-full p-4 md:p-8">
          <Outlet />

          {/* 플로팅 버튼 */}
          <button
            onClick={() => navigate('/create')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center text-4xl pb-2 transition-transform hover:scale-110 z-10"
          >
            +
          </button>
        </main>
      </div>

      {/* ============================================================
          [수정 포인트]
          - top-0 -> top-16 (상단바 높이만큼 내림)
          - h-full -> h-[calc(100vh-4rem)] (화면 꽉 채우되 상단바 제외)
         ============================================================ */}

      {/* 3. 투명 오버레이 (클릭 감지용 막) */}
      {isSidebarOpen && (
        <div
          // top-16: 상단바 아래부터 시작
          className="fixed inset-0 top-16 z-[998] cursor-default bg-transparent"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 4. 사이드바 본체 */}
      <aside
        className={`
          /* top-16: 상단바를 가리지 않고 그 아래에 위치 */
          fixed top-16 left-0 
          /* 높이 계산: 전체 화면 - 상단바 높이(4rem=16) */
          h-[calc(100vh-4rem)] 
          bg-black border-r border-gray-800 
          transition-transform duration-300 ease-in-out pt-6 pl-6
          
          /* z-index 유지 */
          z-[999]

          w-64

          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* 모바일용 닫기 버튼 (X) */}
        {/* 상단바가 보이기 때문에 굳이 X 버튼이 필요 없을 수도 있지만,
            사용자 편의를 위해 남겨두거나 위치를 조정할 수 있습니다. */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 메뉴 링크 목록 */}
        <div className="flex flex-col space-y-6 mt-8 lg:mt-0 w-64">
          <Link
            to="/search"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 text-lg font-medium text-white hover:text-pink-500 transition-colors"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            찾기
          </Link>
          <Link
            to="/my"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 text-lg font-medium text-white hover:text-pink-500 transition-colors"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            마이페이지
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default HomeLayout;
