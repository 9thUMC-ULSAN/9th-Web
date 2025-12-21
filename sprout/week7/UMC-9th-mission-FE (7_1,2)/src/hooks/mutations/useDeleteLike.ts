import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLike } from '../../apis/lp.ts';
import { QUERY_KEY } from '../../constants/key.ts';
import type { Likes, RequestLpDto, ResponseLpDto } from '../../types/lp.ts';
import type { ResponseMyInfoDto } from '../../types/auth.ts';

function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onMutate: async (lp: RequestLpDto) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps] });
      await queryClient.cancelQueries({ queryKey: ['lpDetail', lp.lpId] });

      // 2. 스냅샷 저장
      const previousLpDetail = queryClient.getQueryData<ResponseLpDto>([
        'lpDetail',
        lp.lpId,
      ]);
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);

      // 3. 상세 페이지 캐시 낙관적 업데이트 (좋아요 제거)
      if (previousLpDetail && userId) {
        queryClient.setQueryData(['lpDetail', lp.lpId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              likes: old.data.likes.filter(
                (l: Likes) => Number(l.userId) !== userId
              ),
            },
          };
        });
      }

      // 4. 메인 목록 캐시 낙관적 업데이트 (좋아요 제거)
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
                    return {
                      ...item,
                      likes: item.likes.filter(
                        (l: Likes) => Number(l.userId) !== userId
                      ),
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
      // 5. 에러 시 복구
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          ['lpDetail', newLp.lpId],
          context.previousLpDetail
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // 6. 서버와 동기화
      queryClient.invalidateQueries({ queryKey: ['lpDetail', variables.lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useDeleteLike;
