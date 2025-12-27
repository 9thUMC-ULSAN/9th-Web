import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLpDetail, postLpLike, deleteLpLike } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import { getMyInfo } from '../apis/auth.ts';
import type { Lp } from '../types/lp';
import type { ResponseMyInfoDto } from '../types/auth.ts';
import { QUERY_KEY } from '../constants/key.ts';
// [추가] 공통 컴포넌트 import
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';

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

  // [1] 목록에서 들고 온 데이터 (신뢰도 100%)
  const initialData = (location.state as any) || {};

  // [2] 화면 표시용 State
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialData.likes?.length || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title || '');
  const [editContent, setEditContent] = useState(initialData.content || '');

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
      } catch {
        /* 에러 무시 */
      }
    };
    fetchUserInfo();
  }, [accessToken]);

  // 3. 서버 데이터 조회
  const {
    data: lp,
    isLoading,
    isError,
  } = useQuery<Lp>({
    queryKey: ['lp', id],
    queryFn: () => getLpDetail(id),
    enabled: !!id && !!accessToken,
    placeholderData: initialData.id
      ? { ...initialData, likes: [], tags: [] }
      : undefined,
    staleTime: 0,
  });

  // 4. [핵심] 데이터 동기화
  useEffect(() => {
    if (lp) {
      setEditTitle(lp.title || initialData.title || '');
      setEditContent(lp.content || initialData.content || '');

      let realLikes = lp.likes || [];
      if (realLikes.length === 0 && initialData.likes?.length > 0) {
        realLikes = initialData.likes;
      }

      setLikeCount(realLikes.length);

      if (userInfo?.data?.id) {
        const myId = userInfo.data.id;
        setIsLiked(realLikes.some((like: any) => like.userId === myId));
      }
    } else {
      const initialLikes = initialData.likes || [];
      setLikeCount(initialLikes.length);

      if (userInfo?.data?.id) {
        const myId = userInfo.data.id;
        setIsLiked(initialLikes.some((like: any) => like.userId === myId));
      }
    }
  }, [lp, userInfo]);

  // 5. 좋아요 API
  const likeMutation = useMutation({
    mutationFn: async (wasLiked: boolean) => {
      if (wasLiked) return await deleteLpLike(id);
      else return await postLpLike(id);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
    onError: (error, wasLiked) => {
      console.log('좋아요 에러:', error);
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

  if (!accessToken) return null;
  // [변경] 공통 컴포넌트 사용
  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  // 화면 표시용 변수들
  const currentLp = lp || initialData || {};
  const thumbnailSrc =
    currentLp.thumbnail ||
    initialData.thumbnail ||
    'https://placehold.co/400x400?text=No+Image';
  const displayTitle = currentLp.title || initialData.title || '제목 없음';
  const displayContent =
    currentLp.content || initialData.content || '내용이 없습니다.';
  const displayNickname =
    currentLp.writer?.nickname ||
    initialData.writer?.nickname ||
    userInfo?.data?.name ||
    '알 수 없음';
  const displayProfile =
    currentLp.writer?.profileImage ||
    initialData.writer?.profileImage ||
    'https://placehold.co/100?text=User';
  const displayDate =
    currentLp.createdAt || initialData.createdAt
      ? formatTimeAgo(currentLp.createdAt || initialData.createdAt)
      : 'Just now';
  const displayTags = Array.isArray(currentLp.tags)
    ? currentLp.tags
    : Array.isArray(initialData.tags)
    ? initialData.tags
    : [];

  return (
    <div className="w-full h-full flex justify-center items-start p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#25262B] rounded-2xl p-6 md:p-8 shadow-2xl relative border border-gray-800">
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

        {/* 제목 & 버튼 */}
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

        {/* 썸네일 */}
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
            disabled={!userInfo}
            className={`flex items-center gap-2 group transition-transform hover:scale-110 active:scale-95 ${
              !userInfo ? 'opacity-50 cursor-wait' : ''
            }`}
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
    </div>
  );
};

export default LPDetail;
