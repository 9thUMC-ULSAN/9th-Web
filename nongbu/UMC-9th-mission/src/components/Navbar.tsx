import { Link } from "react-router-dom";
import type { ResponseMyInfoDto } from "../types/auth";
import useSidebar from "../hooks/useSidebar"; 
import Sidebar from "./Sidebar"; 

interface NavbarProps {
  user: ResponseMyInfoDto | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <>
      <nav className="bg-gray-200 border-b border-gray-300 relative z-30">
        <div className="w-full flex flex-wrap items-center justify-between p-4">
          
          {/* 1. 로고 (왼쪽) */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="ml-15 text-left text-xl font-bold whitespace-nowrap text-gray-800">
            LP판
            </span>
          </Link>

          {/* 2. 오른쪽 영역 (로그인/회원가입 정보 + 햄버거 버튼) */}
          <div className="mr-15 flex items-center gap-4">
            
            {/* 조건부 렌더링: 유저 정보가 없으면 로그인/회원가입, 있으면 이름 */}
            {!user ? (
              // 로그인 안 했을 때
              <div className="flex gap-4 text-sm font-medium text-gray-700">
                <Link to="/login" className="black">로그인</Link>
                <Link to="/signup" className="black">회원가입</Link>
              </div>
            ) : (
              // 로그인 했을 때
              <div className="text-sm font-bold black">
                {user.data.name} 님
              </div>
            )}

            {/* 3. 햄버거 버튼 (항상 보임) - 사이드바 열기용 */}
            <button
              onClick={toggle} 
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <span className="sr-only">Open menu</span>
              {/* 햄버거 아이콘 */}
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* 사이드바 연결 (user 정보 전달) */}
      <Sidebar isOpen={isOpen} close={close} user={user} />
    </>
  );
};

export default Navbar;