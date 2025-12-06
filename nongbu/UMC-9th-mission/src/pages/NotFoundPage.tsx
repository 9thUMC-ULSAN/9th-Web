export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-400 to-green-600 text-center">
      <h1
        className="text-8xl font-extrabold text-white md:text-9xl"
        style={{ textShadow: '0 4px 6px rgba(0, 0, 0, 0.4)' }}
      >
        404
      </h1>
      <p
        className="mt-4 text-xl font-medium text-white md:text-2xl"
        style={{ textShadow: '0 3px 4px rgba(0, 0, 0, 0.4)' }}
      >
        페이지를 찾을 수 없습니다.
      </p>
      <a
        href="/"
        className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-green-600 shadow-md transition-colors duration-300 hover:bg-gray-100 hover:scale-105"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}