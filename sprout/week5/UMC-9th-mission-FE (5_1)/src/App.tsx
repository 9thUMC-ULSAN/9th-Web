import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import type { JSX } from 'react';
import MyPage from './pages/MyPage';
import { AuthProvider, useAuth } from './context/AuthContext'; // useAuth 임포트 추가
import ProtectedLayout from './layouts/ProtectedLayout';

// publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
];

// protectedRoutes: 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'my',
        element: <MyPage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

// 💡 [추가] 로딩 중 화면 컴포넌트
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen text-xl font-bold">
    인증 정보를 확인 중입니다...
  </div>
);

function App(): JSX.Element {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}

// 💡 [추가] Context 로딩 상태를 확인하고 라우터를 렌더링하는 컴포넌트
const AuthRouter = (): JSX.Element => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
};

export default App;
