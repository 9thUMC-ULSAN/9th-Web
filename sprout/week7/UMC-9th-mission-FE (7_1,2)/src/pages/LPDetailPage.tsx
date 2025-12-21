import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import useGetInfiniteComments from '../hooks/queries/useGetInfiniteComments';
import { PAGINATION_ORDER } from '../enums/common.ts';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import useGetLpDetail from '../hooks/queries/useGetLpDetail.ts';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import usePostLike from '../hooks/mutations/usePostLike';
import useDeleteLike from '../hooks/mutations/useDeleteLike';
import usePostComment from '../hooks/mutations/usePostComment';
import useUpdateComment from '../hooks/mutations/useUpdateComment';
import useDeleteComment from '../hooks/mutations/useDeleteComment';
// 만약 게시글 삭제 mutation 훅이 있다면 아래와 같이 임포트하세요.
// 없다면 일단 기본 window.confirm과 navigate로 구조를 잡아드렸습니다.
// import useDeleteLp from '../hooks/mutations/useDeleteLp';

import { Heart, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Comment } from '../types/comment.ts';

const CommentSkeleton = () => (
  <div className="flex gap-3 mb-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-700 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-1/4" />
      <div className="h-4 bg-gray-700 rounded w-3/4" />
    </div>
  </div>
);

const LPDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const lpIdNum = Number(lpId);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // 상태 관리
  const [commentInput, setCommentInput] = useState('');
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // 1. 데이터 로드 (상세 정보 & 내 정보)
  const {
    data: lpResponse,
    isLoading: isLpLoading,
    isError: isLpError,
    refetch: refetchLp,
  } = useGetLpDetail({ lpId: lpIdNum });
  const { data: me } = useGetMyInfo(accessToken);

  // 2. 좋아요 관련 Mutation
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  // 3. 댓글 관련 Mutation
  const postCommentMutation = usePostComment(lpIdNum);
  const updateCommentMutation = useUpdateComment(lpIdNum);
  const deleteCommentMutation = useDeleteComment(lpIdNum);

  // 4. 게시글 삭제 Mutation (프로젝트에 해당 훅이 있다면 연동하세요)
  // const deleteLpMutation = useDeleteLp();

  // 5. 댓글 목록 (무한 스크롤)
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isCommentsPending,
  } = useGetInfiniteComments(lpIdNum, 10, commentOrder);
  const { ref: commentRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lpData = lpResponse?.data;
  const isMyPost = Number(lpData?.writer?.id) === Number(me?.data?.id);
  const isLiked =
    lpData?.likes?.some((l: any) => Number(l.userId) === Number(me?.data.id)) ??
    false;

  const handleLikeClick = () => {
    if (!accessToken || !me) return;
    isLiked ? disLikeMutate({ lpId: lpIdNum }) : likeMutate({ lpId: lpIdNum });
  };

  // 게시글 삭제 처리
  const handleDeleteLp = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      // 만약 삭제 API가 있다면 mutation 호출:
      // deleteLpMutation.mutate(lpIdNum, { onSuccess: () => navigate('/') });

      // 임시 알림 및 이동
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    }
  };

  // 댓글 작성 처리
  const handlePostComment = () => {
    if (!commentInput.trim()) return;
    postCommentMutation.mutate(commentInput, {
      onSuccess: () => setCommentInput(''),
    });
  };

  // 댓글 수정 모드 진입
  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditValue(comment.content);
  };

  // 댓글 수정 취소
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditValue('');
  };

  // 댓글 수정 완료 처리
  const handleUpdateComment = (commentId: number) => {
    if (!editValue.trim()) return;
    updateCommentMutation.mutate(
      { commentId, content: editValue },
      { onSuccess: () => cancelEdit() }
    );
  };

  // 댓글 삭제 처리
  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLpLoading) return <Loading />;
  if (isLpError || !lpData)
    return <Error message="로드 실패" onRetry={refetchLp} />;

  return (
    <div className="w-full h-full flex justify-center items-start p-4 md:p-6 overflow-y-auto bg-black text-white">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* LP 메인 카드 섹션 */}
        <div className="bg-[#25262B] rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden border border-gray-500">
                <img
                  src={
                    lpData?.writer?.profileImage ||
                    lpData?.writer?.avator ||
                    'https://placehold.co/100'
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg">
                {lpData?.writer?.nickname || lpData?.writer?.name || '작성자'}
              </span>
            </div>

            {/* 우측 상단 버튼 및 시간 영역 */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-gray-500 text-xs font-medium">
                3 mins ago
              </span>
              {isMyPost && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/edit/${lpIdNum}`)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="게시글 수정"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={handleDeleteLp}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="게시글 삭제"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold break-words">
              {lpData.title}
            </h1>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-[12px] border-gray-800 animate-[spin_20s_linear_infinite]">
              <img
                src={lpData.thumbnail || 'https://placehold.co/400x400'}
                alt={lpData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#25262B] rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700 shadow-inner" />
            </div>
          </div>

          <div className="mb-8 text-center text-gray-300 italic whitespace-pre-wrap">
            "{lpData.content}"
          </div>

          <div className="flex justify-center pb-2">
            <button
              onClick={handleLikeClick}
              className="flex items-center gap-2 transition-transform active:scale-95"
            >
              <Heart
                size={28}
                className={
                  isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-500'
                }
              />
              <span
                className={`text-xl font-bold ${
                  isLiked ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                {lpData.likes?.length || 0}
              </span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-[#25262B] rounded-2xl p-6 border border-gray-800 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">댓글</h2>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  commentOrder === PAGINATION_ORDER.desc
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  commentOrder === PAGINATION_ORDER.asc
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                오래된순
              </button>
            </div>
          </div>

          {/* 댓글 입력창 */}
          <div className="mb-8 relative">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글 입력..."
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 h-24 outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            />
            <button
              onClick={handlePostComment}
              disabled={postCommentMutation.isPending || !commentInput.trim()}
              className="absolute right-3 bottom-3 px-4 py-1.5 rounded-lg bg-pink-500 text-white font-bold text-sm disabled:bg-gray-700 disabled:text-gray-400"
            >
              작성
            </button>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {!isCommentsPending &&
              commentsData?.pages?.map((page: any) =>
                page.data.data.map((comment: Comment) => {
                  const isMyComment =
                    Number(comment.writer?.id) === Number(me?.data?.id);
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="flex gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden shrink-0">
                        <img
                          src={
                            comment.writer?.profileImage ||
                            'https://placehold.co/100'
                          }
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold truncate">
                            {comment.writer?.nickname || comment.writer?.name}
                          </span>

                          {isMyComment && !isEditing && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(comment)}
                                className="p-1 text-gray-500 hover:text-white"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-gray-800 border-b border-pink-500 text-sm py-1 px-2 outline-none"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEdit}
                                className="text-gray-500 hover:text-white"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                className="text-pink-500 hover:text-pink-400"
                              >
                                <Check size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300 text-sm break-words leading-relaxed">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            {isFetchingNextPage && <CommentSkeleton />}
            <div ref={commentRef} className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;
