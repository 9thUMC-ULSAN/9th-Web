import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 인증이 필요한 페이지에 접근을 제어하는 레이아웃 컴포넌트
const ProtectedLayout = () => {
  // 전역 상태에서 Access Token을 가져옵니다.
  const { accessToken } = useAuth();

  // Access Token이 null이면 (로그인 상태가 아니면)
  if (!accessToken) {
    // 로그인 페이지로 리다이렉트합니다.
    // replace={true} 속성은 뒤로가기 히스토리에 남기지 않도록 합니다.
    return <Navigate to="/login" replace={true} />;
  }

  // Access Token이 있으면 (로그인 상태이면)
  // 하위 라우트(Protected Page)의 내용을 렌더링합니다.
  return <Outlet />;
};

export default ProtectedLayout;
