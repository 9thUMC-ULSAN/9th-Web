import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';

// 문제가 되는 'Router' 타입 임포트를 제거했습니다.
// TypeScript가 createBrowserRouter의 반환 타입을 자동으로 추론하도록 변경하여 안정성을 높입니다.

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지
const router = createBrowserRouter([
  // 명시적 타입 지정(router: Router)을 제거했습니다.
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 인덱스 경로는 홈페이지 컴포넌트를 사용해야 하지만, 현재는 <div>로 대체합니다.
      {
        index: true,
        element: <div className="p-8 text-xl font-bold">홈페이지 내용</div>,
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
]);

function App() {
  // RouterProvider를 사용하여 라우터 객체를 애플리케이션에 제공합니다.
  return <RouterProvider router={router} />;
}

export default App;
