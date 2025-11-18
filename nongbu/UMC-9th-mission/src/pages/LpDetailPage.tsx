import { data, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail.ts";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo.ts";
import { useAuth } from "../context/AuthContext.tsx";
import type { Likes } from "../types/lp.ts";
import useDeleteLike from "../hooks/mutations/useDeleteLike.ts";
import usePostLike from "../hooks/mutations/usePostLike.ts";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const { accessToken } = useAuth();
  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();


  // [수정] data 뒤에 ? 추가 (데이터가 없을 때 에러 방지)
  const isLiked: boolean | undefined = lp?.data?.likes?.some(
    (like: Likes) => Number(like.userId) === Number(me?.data?.id)
  );

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };
  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  if (isPending || isError) {
    return <></>;
  }

  return (
    // 1. 전체 페이지 컨테이너
    <div className="min-h-screen bg-gray-100 p-4 py-12 dark:bg-gray-900 md:p-12">
      {/* 2. 상세 정보 카드 */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
        {/* 3. 2단 레이아웃 */}
        <div className="md:flex">
          {/* 3-1. 이미지 섹션 */}
          <div className="md:w-1/2 md:flex-shrink-0">
            <img
              // [수정] data? 추가
              src={lp?.data?.thumbnail}
              alt={lp?.data?.title}
              className="h-full w-full object-cover md:aspect-square"
            />
          </div>

          {/* 3-2. 텍스트 정보 섹션 */}
          <div className="flex flex-col p-8 md:w-1/2 md:p-12">
            {/* ID */}
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {/* [수정] data? 추가 */}
              LP ID #{lp?.data?.id}
            </p>

            {/* Title */}
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {/* [수정] data? 추가 */}
              {lp?.data?.title}
            </h1>

            {/* Content */}
            <p className="mt-6 text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
              {/* [수정] data? 추가 */}
              {lp?.data?.content}
            </p>

            {/* 버튼 섹션 */}
            <div className="mt-8">
              <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
                <Heart
                  color={isLiked ? "red" : "black"}
                  fill={isLiked ? "red" : "transparent"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;