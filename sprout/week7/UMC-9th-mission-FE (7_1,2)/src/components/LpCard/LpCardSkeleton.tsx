const LpCardSkeleton = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg w-full h-64 bg-gray-700 animate-pulse">
      {/* [수정 내역]
        1. h-48 -> h-64 : 원본 카드(LpCard)와 높이를 맞춤
        2. bg-gray-300 -> bg-gray-700 : 다크 모드 배경에 맞게 톤 다운
        3. 내부의 복잡한 div 제거 : 썸네일 로딩 느낌을 위해 깔끔한 박스 형태로 변경
      */}

      {/* (선택 사항) 만약 이미지 아이콘 같은 걸 가운데 넣고 싶다면 아래 주석 해제 */}
      {/* <div className="absolute inset-0 flex items-center justify-center text-gray-600">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div> */}
    </div>
  );
};

export default LpCardSkeleton;
