import type { ReactElement } from 'react';

const AuthHomePage = (): ReactElement => {
  return (
    // 전체 화면 중앙 정렬
    <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white p-8">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center gap-4">
        {/* 앱 이름 크게 표시 (빨간색) */}
        <h1 className="text-6xl sm:text-7xl font-extrabold text-red-600 tracking-wider animate-pulse">
          🍿Movies🍿
        </h1>
        {/* 환영 문구 */}
        <p className="text-xl text-gray-400 font-medium mt-4">
          당신의 영화 취향을 공유하고 새로운 영화를 찾아보세요!
        </p>
        <p className="text-md text-gray-500">
          로그인 후 모든 기능을 이용할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default AuthHomePage;