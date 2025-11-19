import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLPDetail, getComments, createComment } from '../apis/apis';
import CommentSkeleton from '../components/CommentSkeleton';

export default function LPDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentSort, setCommentSort] = useState<'asc' | 'desc'>('desc'); // 최신순 기본
  const [commentContent, setCommentContent] = useState('');
  const loadMoreCommentsRef = useRef<HTMLDivElement>(null);

  // LP 상세 정보 조회
  const { data: lpData, isLoading: isLPLoading, isError: isLPError } = useQuery({
    queryKey: ['lpDetail', lpId],
    queryFn: () => getLPDetail(Number(lpId)),
    enabled: !!lpId,
  });

  // 댓글 목록 조회 (무한 스크롤)
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, commentSort],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) => getComments(Number(lpId), {
      limit: 10,
      cursor: pageParam,
      order: commentSort,
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    initialPageParam: undefined as number | undefined,
    enabled: !!lpId,
  });

  // 모든 페이지의 댓글을 평탄화
  const allComments = commentsData?.pages.flatMap(page => page.data.data) || [];

  // 댓글 작성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(Number(lpId), content),
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      // 입력 필드 초기화
      setCommentContent('');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 작성 핸들러
  const handleSubmitComment = () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate(commentContent);
  };

  // 댓글 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreCommentsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lp = lpData?.data;

  if (isLPLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLPError || !lp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">LP를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* LP 상세 정보 */}
      <div className="bg-gray-900 rounded-lg overflow-hidden mb-8">
        {/* 썸네일 */}
        {lp.thumbnail && (
          <div className="w-full aspect-video bg-gray-800">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 정보 */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{lp.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <span>작성자: {lp.author?.name || '익명'}</span>
            <span>•</span>
            <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
            <span>•</span>
            <span>❤️ {lp.likes?.length || 0}</span>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap">{lp.content}</div>
          {lp.tags && lp.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {lp.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-pink-400 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            댓글 {allComments.length}개
          </h2>
          <button
            onClick={() => setCommentSort(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white text-sm"
          >
            {commentSort === 'desc' ? '최신순' : '오래된순'}
          </button>
        </div>

        {/* 댓글 작성 UI */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitComment}
              disabled={createCommentMutation.isPending || !commentContent.trim()}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {/* 초기 로딩 시 Skeleton */}
          {isCommentsLoading && (
            <>
              {[...Array(5)].map((_, index) => (
                <CommentSkeleton key={`comment-skeleton-${index}`} />
              ))}
            </>
          )}

          {/* 실제 댓글들 */}
          {!isCommentsLoading && allComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                {/* 프로필 이미지 */}
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  {/* 작성자 */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {/* 댓글 내용 */}
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 추가 로딩 시 Skeleton (하단) */}
          {isFetchingNextPage && (
            <>
              {[...Array(5)].map((_, index) => (
                <CommentSkeleton key={`comment-skeleton-more-${index}`} />
              ))}
            </>
          )}

          {/* 빈 상태 */}
          {!isCommentsLoading && allComments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">첫 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={loadMoreCommentsRef} className="h-10" />
      </div>
    </div>
  );
}
