import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/moviepage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import NotFoundPage from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <MoviePage />,
      },
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movies/detail/:movieId',
        element: <MovieDetailPage />,
      },
      {
        path: 'v1/auth/google/callback',
        element: <GoogleCallbackPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
