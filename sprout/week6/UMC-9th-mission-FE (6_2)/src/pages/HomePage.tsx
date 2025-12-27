import { useEffect, useState } from 'react';
import { PAGINATION_ORDER } from '../enums/common.ts';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList.ts';
import { useInView } from 'react-intersection-observer';
import LpCard from '../components/LpCard/LpCard.tsx';
import LpCardSkeletonList from '../components/LpCard/LpCardSkeletonList.tsx';
import Error from '../components/common/Error';

const HomePage = () => {
  const [search] = useState('');
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: lps,
    hasNextPage,
    isPending, // 초기 로딩 상태 (데이터 없음)
    isFetchingNextPage, // 다음 페이지 로딩 상태 (기존 데이터 있음 + 추가 로딩)
    fetchNextPage,
    isError,
    refetch,
  } = useGetInfiniteLpList(20, search, order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    // isFetchingNextPage가 아닐 때만 fetchNextPage 실행 (중복 호출 방지)
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <Error
        message="목록을 불러오는 중 오류가 발생했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="w-full h-full p-2">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4 px-2">
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              order === PAGINATION_ORDER.asc
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              order === PAGINATION_ORDER.desc
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* [조건 1] 초기 로딩 (isPending) -> 전체 스켈레톤 표시 
        [조건 2] 데이터 있음 -> 리스트 표시
      */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
          <LpCardSkeletonList count={20} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
          {lps?.pages
            ?.map((page) => page.data.data)
            ?.flat()
            ?.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}

          {/* [조건 3] 추가 로딩 (isFetchingNextPage) -> 하단에 스켈레톤 추가 표시 */}
          {isFetchingNextPage && <LpCardSkeletonList count={10} />}
        </div>
      )}

      {/* 무한 스크롤 트리거 (데이터가 있을 때만 렌더링) */}
      {!isPending && <div ref={ref} className="h-10 w-full" />}
    </div>
  );
};

export default HomePage;
