import { useAuth } from '../context/AuthContext.tsx';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedLayout = () => {
  // 1. [오류 수정] useAuth 훅에서 accessToken만 구조 분해 할당으로 가져옵니다.
  //    useAuth 훅 내부에 accessToken의 타입 (string | null)이 정의되어 있어야 합니다.
  const { accessToken } = useAuth();

  // 2. [오류 수정] useLocation은 제네릭 없이 사용하거나,
  //    필요한 경우 Location 타입만 명시적으로 임포트하여 사용합니다.
  const location = useLocation();

  // 토큰이 없으면 로그인 페이지로 리다이렉트합니다.
  if (!accessToken) {
    // state에 현재 위치 정보를 담아 로그인 후 원래 페이지로 돌아갈 수 있도록 합니다.
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  // 토큰이 있으면 하위 라우트 컴포넌트(<MyPage /> 등)를 렌더링합니다.
  return <Outlet />;
};

export default ProtectedLayout;
