import type { ReactElement } from 'react';

export const LoadingSpinner = (): ReactElement => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
    <p className="mt-6 text-xl text-gray-300 font-medium">
      데이터를 불러오는 중...
    </p>
  </div>
);
