import { useEffect, useState } from 'react';
import { PAGINATION_ORDER } from '../enums/common.ts';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList.ts';
import { useInView } from 'react-intersection-observer';
import LpCard from '../components/LpCard/LpCard.tsx';
import LpCardSkeletonList from '../components/LpCard/LpCardSkeletonList.tsx';
import Error from '../components/common/Error';

const HomePage = () => {
  const [search] = useState('');

  // [중요] 정렬 상태 관리 (기본값: 최신순)
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  // [중요] 훅에 order 상태를 넣어줘야 버튼 누를 때마다 API를 다시 부릅니다.
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
    refetch, // [추가] 에러 발생 시 재시도하기 위해 refetch 함수를 가져옵니다.
  } = useGetInfiniteLpList(20, search, order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // [변경] 공통 에러 컴포넌트 사용 + 재시도(onRetry) 연결
  if (isError) {
    return (
      <Error
        message="목록을 불러오는 중 오류가 발생했습니다."
        onRetry={() => refetch()} // 버튼 클릭 시 API 재호출
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

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
        {isPending && <LpCardSkeletonList count={20} />}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>

      <div ref={ref} className="h-2"></div>
    </div>
  );
};

export default HomePage;
