import type { ReactElement } from 'react';

export default function NotFoundPage(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-6xl font-extrabold text-[#dda5e3]">404</h1>
      <p className="text-xl text-gray-700 mt-4">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <div className="mt-8 text-sm text-gray-500">
        <p>URL을 확인하거나 홈으로 돌아가 주세요.</p>
      </div>
    </div>
  );
}
