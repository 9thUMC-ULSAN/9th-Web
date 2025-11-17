import type { ReactElement } from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({
  message,
  onRetry,
}: ErrorDisplayProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-red-900/20 border border-red-700 rounded-xl m-8 shadow-2xl">
      <h2 className="text-3xl font-extrabold text-red-400 mb-4">
        🚨 데이터 로딩 실패
      </h2>
      <p className="text-lg text-gray-200 mb-6 text-center leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}