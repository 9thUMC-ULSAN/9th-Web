// src/App.tsx

import {
  createBrowserRouter,
  RouterProvider, // 타입으로도, 값으로도 사용되는 Router를 가져옵니다.
} from 'react-router-dom';

// 필요한 페이지 및 레이아웃 컴포넌트 임포트
import HomeLayout from './layouts/HomeLayout';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';

// Router의 타입 충돌 오류를 피하기 위해, 'Router' 대신
// 'createBrowserRouter' 함수의 반환 타입을 직접 사용합니다.
const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    // 최상위 레이아웃 지정
    element: <HomeLayout />,
    // 오류 발생 시 보여줄 페이지
    errorElement: <NotFoundPage />,
    children: [
      // 인덱스 라우트: 부모 경로('/')와 일치
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'my', element: <MyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
