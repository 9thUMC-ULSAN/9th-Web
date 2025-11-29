interface ErrorProps {
  message?: string;
  onRetry?: () => void; // [추가] 재시도 함수 받기 (선택적)
}

const Error = ({
  message = '데이터를 불러오는데 실패했습니다.',
  onRetry,
}: ErrorProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full min-h-[400px] gap-4">
      <p className="text-red-500 font-bold">{message}</p>

      {/* onRetry 함수가 전달되었을 때만 버튼을 렌더링합니다 */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default Error;
