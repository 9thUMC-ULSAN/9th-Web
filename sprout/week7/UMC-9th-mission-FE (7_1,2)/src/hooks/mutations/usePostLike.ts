import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLike } from '../../apis/lp.ts';
import { QUERY_KEY } from '../../constants/key.ts';
import type { Likes, RequestLpDto, ResponseLpDto } from '../../types/lp.ts';
import type { ResponseMyInfoDto } from '../../types/auth.ts';

function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onMutate: async (lp: RequestLpDto) => {
      // 1. 진행 중인 관련 쿼리 취소 (목록 및 상세)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps] });
      await queryClient.cancelQueries({ queryKey: ['lpDetail', lp.lpId] });

      // 2. 현재 캐시 데이터 스냅샷 저장 (실패 시 복구용)
      const previousLpDetail = queryClient.getQueryData<ResponseLpDto>([
        'lpDetail',
        lp.lpId,
      ]);
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);

      // 3. 상세 페이지 캐시 낙관적 업데이트
      if (previousLpDetail && userId) {
        queryClient.setQueryData(['lpDetail', lp.lpId], (old: any) => {
          if (!old) return old;
          const exists = old.data.likes.some(
            (l: Likes) => Number(l.userId) === userId
          );
          if (exists) return old;
          return {
            ...old,
            data: {
              ...old.data,
              likes: [...old.data.likes, { userId, lpId: lp.lpId }],
            },
          };
        });
      }

      // 4. 메인 목록 캐시(무한 스크롤) 낙관적 업데이트
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEY.lps] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((item: any) => {
                  if (item.id === lp.lpId) {
                    const exists = item.likes.some(
                      (l: Likes) => Number(l.userId) === userId
                    );
                    if (!exists)
                      return {
                        ...item,
                        likes: [...item.likes, { userId, lpId: lp.lpId }],
                      };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousLpDetail };
    },
    onError: (_err, newLp, context) => {
      // 5. 에러 시 이전 상태로 복구
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          ['lpDetail', newLp.lpId],
          context.previousLpDetail
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // 6. 성공/실패 여부와 상관없이 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ['lpDetail', variables.lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default usePostLike;
