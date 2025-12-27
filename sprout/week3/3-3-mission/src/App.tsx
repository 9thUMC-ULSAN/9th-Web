import './App.css';
import MoviePage from './pages/MoviePage';
import HomePage from './pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import type { JSX } from 'react';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  // 1. 최상위 라우트 (HomePage가 부모 역할을 하며 Outlet을 렌더링)
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        // 영화 목록 라우트 (movies/:category)
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        // ⭐️ 영화 상세 페이지 라우트 (movie/:movieId) - 경로 충돌 방지를 위해 단수 'movie' 사용
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
