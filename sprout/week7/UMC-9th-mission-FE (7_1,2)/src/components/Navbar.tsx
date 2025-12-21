import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, logout } = useAuth();

  // 사용자 정보 가져오기 (마이페이지 낙관적 업데이트와 실시간 동기화)
  const { data: userInfo } = useGetMyInfo(accessToken);

  // ✅ [미션 조건] 로그아웃 로직을 useMutation으로 구현
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post('/v1/auth/signout');
    },
    onSuccess: () => {
      logout(); // AuthContext 상태 초기화
      queryClient.clear(); // 모든 캐시 데이터 삭제
      navigate('/'); // 홈으로 이동
    },
    onError: (error: any) => {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 사용자 편의를 위해 클라이언트 로그아웃 처리
      logout();
      navigate('/login');
    },
  });

  const handleLogoutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logoutMutation.mutate();
    }
  };

  const displayName = userInfo?.data?.nickname || userInfo?.data?.name;

  return (
    <nav className="bg-black text-white shadow-md fixed w-full z-50 h-16 border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-white p-1 flex items-center justify-center hover:opacity-80 transition-transform active:scale-95"
          >
            {/* ✅ 버거 버튼 색상: isSidebarOpen 상태와 상관없이 항상 흰색(text-white) 유지 */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
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
                className="px-4 py-2 bg-pink-500 rounded text-white hover:bg-pink-600 transition-colors"
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
                onClick={handleLogoutClick}
                disabled={logoutMutation.isPending}
                className="text-gray-400 hover:text-white underline-offset-4 hover:underline transition-colors disabled:opacity-50"
              >
                {logoutMutation.isPending ? '처리 중...' : '로그아웃'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
