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
import LPDetail from './pages/LPDetail';
import CreatePage from './pages/CreatePage'; // [추가] 글쓰기 페이지 임포트
import type { JSX } from 'react';
import MyPage from './pages/MyPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },
      { path: 'lp/:lpid', element: <LPDetail /> },

      // ▼▼▼ [추가된 부분] 글쓰기 페이지 라우트 연결 ▼▼▼
      // 이제 HomeLayout의 (+) 버튼을 누르면 이 컴포넌트가 렌더링됩니다.
      { path: 'create', element: <CreatePage /> },
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

export const queryClient: QueryClient = new QueryClient();

// 💡 로딩 중 화면 컴포넌트
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

// 💡 Context 로딩 상태를 확인하고 라우터를 렌더링하는 컴포넌트
const AuthRouter = (): JSX.Element => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
};

export default App;
