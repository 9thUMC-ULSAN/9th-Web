const PremiumWebtoonPage = () => {
  return (
    <div className="bg-amber-50 p-8 rounded-xl shadow-lg border-2 border-[#ff9800]">
      <h1 className="text-3xl font-bold text-[#d68300] mb-4">
        ✨ 프리미엄 웹툰 '핑구' 1화 ✨
      </h1>
      <p className="text-gray-700 mb-6">
        이 페이지는 Protected Route를 통해 로그인한 사용자만 볼 수 있습니다.
      </p>
      <img
        src="https://via.placeholder.com/600x300?text=Premium+Webtoon+Content"
        alt="프리미엄 웹툰 이미지"
        className="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>
  );
};

export default PremiumWebtoonPage;
