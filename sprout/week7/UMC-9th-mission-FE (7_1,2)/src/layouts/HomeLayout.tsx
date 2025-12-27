import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import { X } from 'lucide-react';

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMyPage = location.pathname === '/my';
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isMyPage || window.innerWidth >= 1024
  );

  const [showResignModal, setShowResignModal] = useState(false);

  useEffect(() => {
    if (isMyPage) {
      setIsSidebarOpen(true);
    } else if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [isMyPage]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMyPage) {
        if (window.innerWidth >= 1024) setIsSidebarOpen(true);
        else setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMyPage]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleResignSubmit = () => {
    alert('탈퇴 처리가 완료되었습니다.');
    setShowResignModal(false);
    navigate('/login');
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
      <div className="relative z-50">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 pt-16 h-full relative">
        <main
          className={`flex-1 overflow-y-auto bg-black relative w-full p-4 md:p-8 transition-all duration-300 ${
            isSidebarOpen ? 'lg:pl-64' : ''
          }`}
        >
          <Outlet />

          <button
            onClick={() => navigate('/create')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center text-4xl pb-2 transition-transform hover:scale-110 z-10"
          >
            +
          </button>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 top-16 z-[998] cursor-default bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-16 left-0
          h-[calc(100vh-4rem)]
          bg-black border-r border-gray-800
          transition-transform duration-300 ease-in-out pt-6 px-6
          z-[999] w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col space-y-6 mt-8 lg:mt-0">
            {/* ✅ 찾기 버튼: 조건부 색상 로직을 완전히 삭제하고 text-white로 고정했습니다. */}
            <Link
              to="/"
              onClick={() =>
                window.innerWidth < 1024 && setIsSidebarOpen(false)
              }
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

            {/* 마이페이지 버튼 (선택 시 핑크색 유지) */}
            <Link
              to="/my"
              className={`flex items-center gap-3 text-lg font-medium transition-colors ${
                isMyPage
                  ? 'text-pink-500 font-bold'
                  : 'text-white hover:text-pink-500'
              }`}
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

          <div className="mt-auto mb-10">
            <button
              onClick={() => setShowResignModal(true)}
              className="flex items-center gap-3 text-lg font-medium text-gray-500 hover:text-red-500 transition-colors w-full"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              탈퇴하기
            </button>
          </div>
        </div>
      </aside>

      {/* 회원 탈퇴 모달 */}
      {showResignModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1100] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#2A2B31] p-10 rounded-2xl border border-gray-800 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowResignModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-10 mt-4">
              정말 탈퇴하시겠습니까?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleResignSubmit}
                className="flex-1 py-3 bg-[#D1D5DB] text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                예
              </button>
              <button
                onClick={() => setShowResignModal(false)}
                className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
