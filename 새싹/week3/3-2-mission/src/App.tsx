import './App.css';
import MoviePage from './pages/MoviePage';
import HomePage from './pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import type { JSX } from 'react';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movies/:movieId',
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
