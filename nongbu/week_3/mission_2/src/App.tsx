import './App.css'
import NotFoundPage from './components/NotFoundPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage/>,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage/>,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;