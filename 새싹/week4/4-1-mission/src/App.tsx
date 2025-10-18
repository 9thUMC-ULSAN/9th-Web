import './App.css';
import MoviePage from './pages/MoviePage'; // 💡 상대 경로로 복원
import HomePage from './pages/HomePage'; // 💡 상대 경로로 복원
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage'; // 💡 상대 경로로 복원
import type { JSX } from 'react';
import MovieDetailPage from './pages/MovieDetailPage'; // 💡 상대 경로로 복원

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
        // ⭐️ 영화 상세 페이지 라우트 (movie/:movieId)
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
