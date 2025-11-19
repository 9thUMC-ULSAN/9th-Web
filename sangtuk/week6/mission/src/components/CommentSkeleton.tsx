/**
 * 댓글 스켈레톤 컴포넌트
 * 댓글 로딩 중일 때 표시되는 placeholder
 */
export default function CommentSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0"></div>

        <div className="flex-1 space-y-2">
          {/* 작성자 이름 */}
          <div className="h-4 bg-gray-800 rounded w-24"></div>
          {/* 댓글 내용 */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-800 rounded w-full"></div>
            <div className="h-3 bg-gray-800 rounded w-5/6"></div>
          </div>
          {/* 날짜 */}
          <div className="h-3 bg-gray-800 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}
