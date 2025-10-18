import { type FC } from 'react'; // ⭐️ React.FC 사용을 위해 FC 타입만 import
import './App.css';
import MoviePage from './pages/MoviePage';

// ⭐️ React.FC를 사용하여 컴포넌트를 정의하고, 불필요한 React import 경고를 제거했습니다.
const App: FC = () => {
  return (
    <div>
      <MoviePage />
    </div>
  );
};

export default App;
