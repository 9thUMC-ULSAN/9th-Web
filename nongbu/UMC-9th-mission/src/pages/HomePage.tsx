import { PAGINATION_ORDER } from "../enums/common.ts";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.tsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard.tsx";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import useThrottle from "../hooks/useThrottle.ts";


const HomePage = () => { 
  // 검색어 상태 관리 (초기값 빈 문자열)
const [search, setSearch] = useState<string>("");

// search 값이 10000ms (10초) 동안 변경되지 않으면 debouncedValue에 반영
const debouncedValue: string = useDebounce(search, 300);
   // initialState:
  // const { data, isPending, isError } = useGetLpList({ 
  //   search,
  //   limit: 50,
  // });
  
  const { 
    data: lps, 
    isFetching, 
    hasNextPage, 
    isPending, 
    fetchNextPage, 
    isError 
  } = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.desc);
  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true

  const { ref, inView } = useInView ({
      threshold: 0,
  });
  
  const [loadTrigger, setLoadTrigger] = useState(0);

  useEffect(() => {
    // 화면에 보이고, 로딩 중 아님, 다음 페이지 있음 -> 트리거 숫자 증가!
    if (inView && !isFetching && hasNextPage) {
      setLoadTrigger((prev) => prev + 1);
    }
  }, [inView, isFetching, hasNextPage]);
  
  const throttledTrigger = useThrottle(loadTrigger, 2000);

  useEffect(() => {
    // 0이 아닐 때만 실행 (초기 렌더링 방지)
    if (throttledTrigger > 0) {
      fetchNextPage();
    }
  }, [throttledTrigger, fetchNextPage]);



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative mb-8 max-w-xl mx-auto">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        </div>

        <input
          // Sleek 디자인: border-gray-300, rounded-full, shadow-lg 적용
          className={"w-full py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-full shadow-lg transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}
          placeholder={"검색어를 입력하세요"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        }>
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"></div>
    </div>
  );
};
export default HomePage; 