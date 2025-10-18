// 파일명: src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.tsx';

// 임시 메인 페이지 컴포넌트
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-green-600 mb-6 tracking-wider">
        🌱sprout
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        회원가입 미션 페이지로 이동합니다.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-700 transition-colors shadow-lg"
        >
          회원가입 페이지로 이동
        </button>
      </div>
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
          <Route path="/signup" element={<SignupPage />} />{' '}
          {/* 1. 경로 설정 완료 */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
