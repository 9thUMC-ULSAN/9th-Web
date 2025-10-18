import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx'; // .tsx 확장자를 명시했습니다.

// 임시 메인 페이지 컴포넌트
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-pink-500 mb-4">
        메인 페이지 (로그인 전 화면)
      </h1>
      <p className="text-neutral-400 mb-8">로그인 페이지로 이동해 보세요.</p>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
};

// 메인 앱 컴포넌트
const App: React.FC = () => {
  return (
    // Tailwind CSS 설정을 위한 스크립트 추가
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 다른 라우트들을 여기에 추가할 수 있습니다 */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
