import React from 'react';
import useForm from '../hooks/useForm.ts';
import type { FormValues } from '../hooks/useForm.ts';
import { useNavigate } from 'react-router-dom';

// useForm의 초기 값 설정
const initialValues: FormValues = {
  email: '',
  password: '',
};

const LoginPage: React.FC = () => {
  // useForm 훅에서 폼 상태 및 핸들러 가져오기 (미션 4번 조건 충족)
  const { values, errors, isFormValid, handleChange, handleSubmit } =
    useForm(initialValues);
  const navigate = useNavigate();

  // 폼 제출 시 실행할 실제 로그인 로직
  const handleLogin = (formValues: FormValues) => {
    console.log('로그인 시도:', formValues);
    alert('로그인 성공! (실제 API 호출 필요)');
  };

  return (
    // 디자인 변경: 배경을 검은색 그라데이션으로 설정
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* 헤더 영역 (앱 이름 및 네비게이션) */}
      <header className="w-full h-16 px-4 flex items-center justify-between border-b border-gray-800 bg-gray-900 shadow-lg">
        <h1 className="text-2xl font-extrabold text-pink-400 tracking-wider">
          돌려돌려LP판
        </h1>
        <div className="flex space-x-2">
          <button className="px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors border border-gray-700 rounded-lg">
            로그인
          </button>
          <button className="px-4 py-1 text-sm bg-pink-500 rounded-lg font-semibold hover:bg-pink-400 shadow-md transition-colors">
            회원가입
          </button>
        </div>
      </header>

      {/* 로그인 폼 컨테이너: 카드 디자인 적용 */}
      <div className="w-full max-w-md mt-16 p-8 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
        {/* 뒤로 가기 버튼 및 제목 (미션 1번 조건 충족) */}
        <div className="flex items-center justify-center relative mb-10">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1 text-3xl text-gray-400 hover:text-pink-400 transition-colors"
            aria-label="이전 페이지로 이동"
          >
            {/* 인라인 SVG (ChevronLeft) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white">로그인</h2>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            className="w-full flex items-center justify-center p-3 border border-pink-500 text-white rounded-xl bg-gray-900 hover:bg-gray-700 transition-colors space-x-3 shadow-lg"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.54 24.35H24v7.35h12.59c-.58 3.51-2.9 6.46-6.42 8.35v6.52h8.46c4.95-4.57 7.82-11.23 7.82-19.22c0-1.3-.12-2.54-.34-3.75z"
                fill="#4285F4"
              />
              <path
                d="M24 45.5c6.64 0 12.27-2.19 16.36-6.07l-8.46-6.52c-2.34 1.57-5.32 2.5-8.89 2.5c-6.85 0-12.67-4.63-14.78-10.87H.76v6.79c4.15 8.24 12.8 13.9 23.24 13.9z"
                fill="#34A853"
              />
              <path
                d="M9.22 24.35c-.41-1.15-.65-2.37-.65-3.65c0-1.28.24-2.5.65-3.65V10.26H.76c-1.39 2.76-2.19 5.86-2.19 9.87s.8 7.11 2.19 9.87l8.46-6.79z"
                fill="#FBBC05"
              />
              <path
                d="M24 8.78c3.6 0 6.83 1.25 9.38 3.58l7.25-7.25C37.06 1.83 31.06 0 24 0C13.52 0 4.87 5.66.76 13.9l8.46 6.79c2.11-6.24 7.93-10.87 14.78-10.87z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-semibold text-base">구글로 3초 로그인</span>
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-4 text-xs text-gray-500 font-medium">또는</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* 이메일 입력 필드 (2. 에러 메시지 표시) */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소를 입력해주세요"
              value={values.email}
              onChange={handleChange}
              className={`w-full p-4 bg-gray-700 rounded-xl text-sm placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner ${
                errors.email ? 'border-2 border-red-500 ring-0' : 'border-none'
              }`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-400 font-medium">
                {errors.email}
              </p> // 에러 메시지 표시 (미션 2번 충족)
            )}
          </div>

          {/* 비밀번호 입력 필드 (2. 에러 메시지 표시) */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요 (최소 6자)"
              value={values.password}
              onChange={handleChange}
              className={`w-full p-4 bg-gray-700 rounded-xl text-sm placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner ${
                errors.password
                  ? 'border-2 border-red-500 ring-0'
                  : 'border-none'
              }`}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-400 font-medium">
                {errors.password}
              </p> // 에러 메시지 표시 (미션 2번 충족)
            )}
          </div>

          {/* 로그인 버튼 (3. 버튼 활성화 로직) */}
          <button
            type="submit"
            disabled={!isFormValid} // 유효성 검사 통과 시에만 활성화 (미션 3번 조건 충족)
            className={`w-full p-4 mt-6 rounded-xl font-bold text-base transition-all shadow-lg ${
              isFormValid
                ? 'bg-pink-500 hover:bg-pink-400 cursor-pointer' // 활성화 상태 스타일
                : 'bg-gray-700 text-gray-500 cursor-not-allowed' // 비활성화 상태 스타일
            }`}
          >
            로그인
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-400">
          계정이 없으신가요?{' '}
          <a href="#" className="text-pink-400 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
