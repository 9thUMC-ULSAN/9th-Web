import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import MovieLayout from './layouts/MovieLayout';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage';
import type { JSX } from 'react';
import MyPage from './pages/MyPage';

const router = createBrowserRouter([
  // 1. 인증 관련 라우트 그룹
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'my', element: <MyPage /> },
    ],
  },

  // ⭐️ 2. 영화 콘텐츠 라우트 그룹 (최상위에서 정의)
  {
    element: <MovieLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 영화 목록: /movies/popular
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      // 영화 상세: /movie/123 -> 이 경로를 Link 컴포넌트가 안정적으로 호출합니다.
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
