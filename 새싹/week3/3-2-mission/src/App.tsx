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
        // ⭐️ 상대 경로 복원: 'movies/'로 시작하여 부모의 경로('/')에 이어집니다.
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        // ⭐️ 상대 경로 복원: 'movies/'로 시작하여 부모의 경로('/')에 이어집니다.
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
]);

// App 컴포넌트의 반환 타입은 React의 표준인 JSX.Element로 정확하게 정의되어 있습니다.
function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
