import { useEffect, useState } from 'react';
import { PAGINATION_ORDER } from '../enums/common.ts';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList.ts';
import { useInView } from 'react-intersection-observer';
import LpCard from '../components/LpCard/LpCard.tsx';
import LpCardSkeletonList from '../components/LpCard/LpCardSkeletonList.tsx';
import useDebounce from '../hooks/useDebounce.ts';
import { SEARCH_DEBOUNCE_DELAY } from '../constants/delay.ts';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  //const { data, isPending, isError } = useGetLpList({
  //  search,
  //  limit: 50,
  //});

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.asc);

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isError) {
    return <div className={'mt-20'}>Error...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <input
        className={'border p-4 rounded-sm'}
        placeholder={'검색어를 입력하세요.'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        className={
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        }
      >
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
