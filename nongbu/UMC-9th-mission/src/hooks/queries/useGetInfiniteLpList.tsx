import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp.ts";
import { PAGINATION_ORDER } from "../../enums/common.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLpListDto } from "../../types/lp.ts";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER,
) {
  return useInfiniteQuery({ 
    queryFn: ({ pageParam }) =>
      getLpList({ 
        cursor: pageParam, limit, search, order 
      }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage: ResponseLpListDto) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList; 