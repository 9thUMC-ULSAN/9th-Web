import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // index.css import (고객님 파일 구조 반영)
import App from './App';
import { TodoProvider } from './context/TodoContext'; // TodoProvider import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* TodoProvider로 App 전체를 감싸서 Context를 주입합니다. */}
    <TodoProvider>
      <App />
    </TodoProvider>
  </StrictMode>
);
