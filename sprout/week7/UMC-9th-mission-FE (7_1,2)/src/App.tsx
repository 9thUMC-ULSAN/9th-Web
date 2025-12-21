import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import type { JSX } from 'react';
import MyPage from './pages/MyPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LPDetailPage from './pages/LPDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      {
        // 1. 공통 레이아웃 (누구나 접근 가능)
        element: <HomeLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
          {
            path: 'v1/auth/google/callback',
            element: <GoogleLoginRedirectPage />,
          },
          // ✅ 상세 페이지 경로는 여기서 하나만 관리합니다.
          { path: 'lps/:lpId', element: <LPDetailPage /> },
        ],
      },
      {
        // 2. 보호된 레이아웃 (로그인 시 사용)
        element: <ProtectedLayout />,
        children: [
          { path: 'my', element: <MyPage /> },
          { path: 'create', element: <CreatePage /> },
        ],
      },
    ],
  },
]);

export const queryClient: QueryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen text-xl font-bold text-white">
    인증 정보를 확인 중입니다...
  </div>
);

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthRouter />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

const AuthRouter = (): JSX.Element => {
  const { isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return <RouterProvider router={router} />;
};

export default App;
