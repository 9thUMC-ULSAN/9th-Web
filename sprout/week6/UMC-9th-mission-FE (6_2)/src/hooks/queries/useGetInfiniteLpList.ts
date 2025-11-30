import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp.ts';
import { PAGINATION_ORDER } from '../../enums/common.ts';
import { QUERY_KEY } from '../../constants/key.ts';

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    // 👇 [추가] 캐시 정책: 1분 동안은 데이터를 '신선'하다고 판단 (로딩 X)
    staleTime: 1000 * 60 * 1,
    // 👇 [추가] 가비지 컬렉션: 5분 뒤에 메모리에서 제거 (기본값이라 생략 가능하지만 명시하면 좋음)
    gcTime: 1000 * 60 * 5,
  });
}

export default useGetInfiniteLpList;
