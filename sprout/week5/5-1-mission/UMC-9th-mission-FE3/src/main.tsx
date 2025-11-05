import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// App.tsx에서 createBrowserRouter를 사용했기 때문에 main.tsx에서는 BrowserRouter 대신 RouterProvider를 사용합니다.
// 이 코드는 App.tsx에서 RouterProvider를 사용하는 최종 구조를 반영합니다.

const rootElement = document.getElementById('root');

if (rootElement) {
  // App 컴포넌트가 RouterProvider를 포함하고 있으므로 App을 직접 렌더링
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element 'root' not found.");
}
