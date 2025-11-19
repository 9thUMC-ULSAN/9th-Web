import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLPs } from '../apis/apis';
import LPCard from '../components/LPCard';
import LPCardSkeleton from '../components/LPCardSkeleton';
import FloatingButton from '../components/FloatingButton';

export default function HomePage() {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) => getLPs({
      limit: 10,
      cursor: pageParam,
      order: sort === 'latest' ? 'desc' : 'asc'
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    initialPageParam: undefined as number | undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const toggleSort = () => {
    setSort(prev => prev === 'latest' ? 'oldest' : 'latest');
  };

  // 모든 페이지의 LP를 평탄화
  const allLPs = data?.pages.flatMap(page => page.data.data) || [];

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">에러가 발생했습니다.</p>
          <p className="text-gray-400 mb-4">{(error as Error).message}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">전체 LP</h1>
          <p className="text-gray-400 mt-1">총 {allLPs.length}개의 LP</p>
        </div>
        <button
          onClick={toggleSort}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <span className="font-medium">{sort === 'latest' ? '최신순' : '오래된순'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* LP 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {/* 초기 로딩 시 Skeleton UI */}
        {isLoading && (
          <>
            {[...Array(10)].map((_, index) => (
              <LPCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {/* 실제 LP 카드들 */}
        {!isLoading && allLPs.map((lp) => (
          <LPCard key={lp.id} lp={lp} />
        ))}

        {/* 추가 로딩 시 Skeleton UI (하단) */}
        {isFetchingNextPage && (
          <>
            {[...Array(10)].map((_, index) => (
              <LPCardSkeleton key={`skeleton-more-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* 빈 상태 */}
      {!isLoading && allLPs.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📀</div>
          <p className="text-gray-400 text-lg">LP가 없습니다.</p>
        </div>
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="h-10" />

      <FloatingButton />
    </div>
  );
}
