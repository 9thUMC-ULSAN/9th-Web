import { useInfiniteQuery } from '@tanstack/react-query';

import { PAGINATION_ORDER } from '../../enums/common.ts';
import { getCommentList } from '../../apis/comment.ts';
// 1. 새로 만든 파일 경로를 지정해야 합니다.
// 2. export default로 내보냈으므로 중괄호 { } 없이 가져옵니다.

function useGetInfiniteComments(
  lpId: number,
  limit: number,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getCommentList(lpId, { cursor: pageParam, limit, order }),

    queryKey: ['lpComments', lpId, order],

    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 1,
  });
}

export default useGetInfiniteComments;
