import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp.ts';
import { PAGINATION_ORDER } from '../../enums/common.ts';
import { QUERY_KEY } from '../../constants/key.ts';

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
  //TypeScript에서 **타입(Interface, Type)**을 정의할 때는 세미콜론(;)을 쓰지만,
  //  **함수(Function)**를 만들 때는 콤마(,)를 씁니다.
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      //console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
