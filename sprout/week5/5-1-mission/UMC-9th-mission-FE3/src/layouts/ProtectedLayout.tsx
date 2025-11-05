import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // useAuth를 함수로 임포트

const ProtectedLayout = () => {
  // useAuth 훅을 호출하고 비구조화 할당하여 isLoggedIn 속성을 가져옵니다.
  const { isLoggedIn } = useAuth();

  // isLoggedIn 속성이 false일 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to={'/login'} replace />;
  }

  // 로그인 상태라면 하위 라우트(Outlet)를 렌더링
  return <Outlet />;
};

export default ProtectedLayout;
