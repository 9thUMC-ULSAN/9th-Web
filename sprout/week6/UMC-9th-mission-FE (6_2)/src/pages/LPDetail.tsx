import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer'; // ✅ HomePage와 동일한 라이브러리 사용
import { getLpDetail, postLpLike, deleteLpLike } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth.ts';
import useGetInfiniteComments from '../hooks/queries/useGetInfiniteComments';
import type { Lp } from '../types/lp';
import type { ResponseCommentListDto, Comment } from '../types/comment.ts';
import type { ResponseMyInfoDto } from '../types/auth.ts';
import { QUERY_KEY } from '../constants/key.ts';
import { PAGINATION_ORDER } from '../enums/common.ts';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';

// 댓글 스켈레톤

const CommentSkeleton = () => (
  <div className="flex gap-3 mb-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-700 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-1/4" />
      <div className="h-4 bg-gray-700 rounded w-3/4" />
    </div>
  </div>
);

const formatTimeAgo = (dateValue: string | Date) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

const LPDetail = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const id = Number(lpid);
  const { accessToken } = useAuth();
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto | null>(null);
  const alertShown = useRef(false);

  // 댓글 관련 상태
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );

  const [commentText, setCommentText] = useState('');

  // 데이터 초기화

  const initialData = (location.state as any) || {};
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialData.likes?.length || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title || '');
  const [editContent, setEditContent] = useState(initialData.content || '');

  // ✅ [수정 1] HomePage와 동일한 감지 센서 설정 (threshold: 0)

  const { ref: commentRef, inView: commentInView } = useInView({
    threshold: 0,
  });

  // 1. 로그인 체크
  useEffect(() => {
    if (!accessToken && !alertShown.current) {
      alertShown.current = true;
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [accessToken, navigate, location.pathname]);

  // 2. 내 정보 로드

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) return;
      try {
        const response = await getMyInfo();
        setUserInfo(response);
      } catch {}
    };

    fetchUserInfo();
  }, [accessToken]);

  // 3. LP 상세 조회

  const {
    data: lp,
    isLoading: isLpLoading,
    isError: isLpError,
  } = useQuery<Lp>({
    queryKey: ['lp', id],
    queryFn: () => getLpDetail(id),
    enabled: !!id && !!accessToken,
    placeholderData: initialData.id
      ? { ...initialData, likes: [], tags: [] }
      : undefined,
    staleTime: 0,
  });

  // 4. 댓글 목록 조회
  // ✅ [수정 2] limit을 20으로 설정하여 화면을 충분히 채움
  const {
    data: commentsData,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
    isPending: isCommentsPending,
  } = useGetInfiniteComments(id, 20, commentOrder);
  //테스트 할때는 useGetInfiniteComments(id, 2, commentOrder); 이렇게 함

  // 5. 댓글 무한 스크롤 트리거

  // ✅ [수정 3] HomePage의 useEffect 로직과 동일하게 적용

  useEffect(() => {
    if (commentInView && hasNextComments && !isFetchingNextComments) {
      fetchNextComments();
    }
  }, [
    commentInView,
    hasNextComments,
    isFetchingNextComments,
    fetchNextComments,
  ]);

  // 데이터 동기화

  useEffect(() => {
    if (lp) {
      setEditTitle(lp.title || initialData.title || '');
      setEditContent(lp.content || initialData.content || '');
      let realLikes = lp.likes || [];

      if (realLikes.length === 0 && initialData.likes?.length > 0)
        realLikes = initialData.likes;

      setLikeCount(realLikes.length);

      if (userInfo?.data?.id) {
        setIsLiked(
          realLikes.some((like: any) => like.userId === userInfo.data.id)
        );
      }
    } else {
      const initialLikes = initialData.likes || [];

      setLikeCount(initialLikes.length);

      if (userInfo?.data?.id) {
        setIsLiked(
          initialLikes.some((like: any) => like.userId === userInfo.data.id)
        );
      }
    }
  }, [lp, userInfo]);

  const likeMutation = useMutation({
    mutationFn: async (wasLiked: boolean) => {
      if (wasLiked) return await deleteLpLike(id);
      else return await postLpLike(id);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },

    onError: (_error, wasLiked) => {
      setIsLiked(wasLiked);
      setLikeCount((prev: number) =>
        wasLiked ? prev + 1 : Math.max(0, prev - 1)
      );
    },
  });

  const handleLikeClick = () => {
    if (!accessToken || !userInfo?.data?.id) return;
    const currentStatus = isLiked;
    setIsLiked(!currentStatus);
    setLikeCount((prev: number) =>
      currentStatus ? Math.max(0, prev - 1) : prev + 1
    );
    likeMutation.mutate(currentStatus);
  };

  const handleSave = () => {
    alert('수정되었습니다 (API 연동 필요)');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제되었습니다 (API 연동 필요)');
      navigate('/');
    }
  };

  // 로딩 및 에러 처리 (새로고침 시 데이터 증발 방지)
  if (!accessToken) return null;
  const isDataMissing = !lp && (!initialData || !initialData.id);
  if (isLpLoading || isDataMissing) return <Loading />;
  if (isLpError) return <Error />;
  // 화면 표시 변수

  const currentLp = lp || initialData || {};

  const thumbnailSrc =
    currentLp.thumbnail ||
    initialData.thumbnail ||
    'https://placehold.co/400x400';

  const displayTitle = currentLp.title || initialData.title || '제목 없음';

  const displayContent =
    currentLp.content || initialData.content || '내용이 없습니다.';

  const displayNickname =
    currentLp.writer?.nickname || userInfo?.data?.name || '알 수 없음';

  const displayProfile =
    currentLp.writer?.profileImage || 'https://placehold.co/100';

  const displayDate =
    currentLp.createdAt || initialData.createdAt
      ? formatTimeAgo(currentLp.createdAt || initialData.createdAt)
      : 'Just now';

  const displayTags = currentLp.tags || [];

  return (
    <div className="w-full h-full flex justify-center items-start p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* === [LP 상세 카드] === */}

        <div className="bg-[#25262B] rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800 relative">
          {/* 헤더 */}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border border-gray-500">
                <img
                  src={displayProfile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="font-bold text-base text-white">
                {displayNickname}
              </span>
            </div>

            <span className="text-gray-400 text-xs font-medium">
              {displayDate}
            </span>
          </div>

          {/* 제목 및 버튼 */}

          <div className="flex justify-between items-start mb-8">
            <div className="flex-1 pr-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-pink-500 text-2xl font-bold text-white focus:outline-none pb-1"
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-keep">
                  {displayTitle}
                </h1>
              )}
            </div>

            <div className="flex gap-2 text-gray-400 shrink-0 mt-1">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="hover:text-green-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 썸네일 (CD 모양 복구) */}

          <div className="flex justify-center mb-8">
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-gray-800 animate-[spin_20s_linear_infinite]">
              <img
                src={thumbnailSrc}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#25262B] rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-gray-700 shadow-inner">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>

              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* 본문 */}

          <div className="mb-6 px-2">
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-32 bg-gray-800/50 text-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none text-base leading-relaxed"
              />
            ) : (
              <div className="text-gray-300 text-base leading-relaxed text-center whitespace-pre-wrap font-light italic">
                "{displayContent}"
              </div>
            )}
          </div>

          {/* 태그 */}

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {displayTags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-[#34353A] text-gray-300 rounded-full text-xs font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* 좋아요 버튼 */}

          <div className="flex justify-center pb-2">
            <button
              onClick={handleLikeClick}
              className="flex items-center gap-2 group transition-transform hover:scale-110 active:scale-95"
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  isLiked
                    ? 'text-pink-500 fill-current'
                    : 'text-gray-500 fill-none stroke-current stroke-2'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              <span
                className={`text-xl font-bold ${
                  isLiked ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                {likeCount}
              </span>
            </button>
          </div>
        </div>

        {/* === [댓글 섹션: HomePage 구조 완벽 적용] === */}

        <div className="bg-[#25262B] rounded-2xl p-6 shadow-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">댓글</h2>

            <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
              <button
                onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  commentOrder === PAGINATION_ORDER.desc
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                최신순
              </button>

              <button
                onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  commentOrder === PAGINATION_ORDER.asc
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                오래된순
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력해주세요..."
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700 placeholder-gray-500"
              />

              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  commentText.length > 0
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={commentText.length === 0}
              >
                작성
              </button>
            </div>

            {commentText.length > 0 && commentText.length < 5 && (
              <p className="text-red-400 text-xs mt-2 ml-1">
                * 댓글은 최소 5자 이상 입력해주세요.
              </p>
            )}
          </div>

          {/* ✅ [수정 4] HomePage와 동일한 구조로 변경 */}
          <div className="space-y-4">
            {/* 1. 초기 로딩 중 (전체 스켈레톤) */}
            {isCommentsPending ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : (
              <>
                {/* 2. 데이터 렌더링 */}
                {commentsData?.pages?.map((page: ResponseCommentListDto) =>
                  page.data.data.map((comment: Comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden shrink-0 border border-gray-600">
                        <img
                          src={
                            comment.writer?.profileImage ||
                            'https://placehold.co/100'
                          }
                          alt={comment.writer?.nickname}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-bold text-white">
                            {comment.writer?.nickname}
                          </span>

                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* 3. 추가 로딩 중 (하단 스켈레톤) */}

                {isFetchingNextComments && <CommentSkeleton />}
              </>
            )}

            {/* ✅ [핵심 수정] 무한 스크롤 트리거 (HomePage처럼 h-10 w-full로 키움) */}

            {!isCommentsPending && (
              <div ref={commentRef} className="h-10 w-full" />
            )}

            {/* 데이터 없음 안내 */}

            {!isCommentsPending &&
              commentsData?.pages[0]?.data.data.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  첫 번째 댓글을 남겨보세요!
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPDetail;
