import { Link } from "react-router-dom";
import type { ResponseMyInfoDto } from "../types/auth";

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
  user: ResponseMyInfoDto | null;
}

const Sidebar = ({ isOpen, close, user }: SidebarProps) => {
  return (
    <>
      {/* 배경 (클릭 시 닫힘) */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* 사이드바 패널 */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          
          {/* 닫기 버튼 */}
          <div className="flex justify-end mb-8">
            <button onClick={close} className="text-gray-500 hover:text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-bold mb-6 text-gray-800">메뉴</h2>

          {/* 메뉴 링크들 */}
          <nav className="flex flex-col space-y-4">
            
            {/* 홈 링크 */}
            <Link 
              to="/" 
              onClick={close} 
              className="text-lg text-gray-700 hover:text-blue-600 border-b border-gray-100 pb-2"
            >
              홈
            </Link>

            {/* 마이페이지 링크 (여기에 네가 원하는 기능 집중!) */}
            {user ? (
               <Link 
               to="/my" 
               onClick={close}
               className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 flex items-center justify-between"
             >
               <span>마이페이지</span>
               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">GO</span>
             </Link>
            ) : (
              // 로그인 안 했을 때 마이페이지 누르면 로그인 창으로 보내거나 안내
              <Link 
                to="/login"
                onClick={close}
                className="text-lg text-gray-400 border-b border-gray-100 pb-2"
              >
                마이페이지 (로그인 필요)
              </Link>
            )}
            
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;