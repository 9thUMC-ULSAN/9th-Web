/**
 * LP 카드 스켈레톤 컴포넌트
 * 로딩 중일 때 표시되는 placeholder
 */
export default function LPCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
      {/* 이미지 영역 - 정사각형 */}
      <div className="w-full aspect-square bg-gray-800"></div>
    </div>
  );
}
