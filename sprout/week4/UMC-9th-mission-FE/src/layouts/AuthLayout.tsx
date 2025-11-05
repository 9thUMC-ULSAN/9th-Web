import { Outlet, useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';

// lucide-react 대신 인라인 SVG 컴포넌트를 정의합니다. (로그인 아이콘)
const LogInIcon = (props: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);

// lucide-react 대신 인라인 SVG 컴포넌트를 정의합니다. (회원가입 아이콘)
const UserPlusIcon = (props: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const NavButton = ({
  to,
  text,
  Icon,
}: {
  to: string;
  text: string;
  Icon: React.ElementType;
}): ReactElement => {
  const navigate = useNavigate();
  const isSignup = text === '회원가입';

  return (
    <button
      onClick={() => navigate(to)}
      className={`
        px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1
        ${
          isSignup
            ? 'bg-red-600 text-white hover:bg-red-700' // 빨간색 적용
            : 'bg-transparent text-gray-300 border border-gray-600 hover:text-white hover:border-white'
        }
      `}
    >
      <Icon size={16} />
      {text}
    </button>
  );
};

const AuthLayout = (): ReactElement => {
  return (
    // 전체 배경을 검은색으로 설정
    <div className="h-dvh flex flex-col bg-black text-white">
      {/* 네비게이션 바: 고정 높이, 검은색 배경 */}
      <nav className="h-16 flex items-center justify-between px-8 bg-black border-b border-gray-800">
        {/* 로고 영역 */}
        <div className="text-2xl font-extrabold text-red-600 tracking-wider">
          🍿Movies🍿
        </div>

        {/* 오른쪽 버튼 영역 */}
        <div className="flex gap-3">
          <NavButton to="/login" text="로그인" Icon={LogInIcon} />
          <NavButton to="/signup" text="회원가입" Icon={UserPlusIcon} />
        </div>
      </nav>

      {/* 메인 콘텐츠 영역: 남은 공간 모두 사용 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="h-10 text-center text-gray-600 text-xs flex items-center justify-center border-t border-gray-900">
        &copy; 2024 🍿Movies🍿 UMC FE 9th Mission
      </footer>
    </div>
  );
};

export default AuthLayout;