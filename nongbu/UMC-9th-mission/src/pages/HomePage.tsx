import { PAGINATION_ORDER } from "../enums/common.ts";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.tsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Lp, ResponseLpListDto } from "../types/lp.ts";
import LpCard from "../components/LpCard/LpCard.tsx";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";

const HomePage = () => { 
  const [search, setSearch]= useState(""); // initialState:
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
  } = useGetInfiniteLpList(10, search, PAGINATION_ORDER.desc);

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true

  const { ref, inView } = useInView ({
      threshold: 0,
  });
  useEffect( () => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className="container mx-auto px-4 py-6">
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        }>
        {lps?.pages
          ?.map((page : ResponseLpListDto) => page.data.data)
          ?.flat()
          ?.map((lp : Lp) => <LpCard key={lp.id} lp={lp} />)}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"></div>
    </div>
  );
};
export default HomePage; 