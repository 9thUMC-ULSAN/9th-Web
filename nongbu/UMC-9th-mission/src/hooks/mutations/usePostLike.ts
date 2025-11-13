import { useMutation } from "@tanstack/react-query";
import type { RequestLpDto, ResponseLikeLpDto, Likes } from "../../types/lp";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

// userId 추가된 타입
type PostLikeVariables = RequestLpDto & { userId: number };

function usePostLike() {
  return useMutation({
    mutationFn: (variables: PostLikeVariables) => postLike(variables),

    // 1. [낙관적 업데이트] 가짜로 빨갛게 칠하기
    onMutate: async ({ lpId, userId }: PostLikeVariables) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpId] });
      const previousLp = queryClient.getQueryData([QUERY_KEY.lps, lpId]);

      queryClient.setQueryData([QUERY_KEY.lps, lpId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            // 내 아이디 넣어서 좋아요 목록 갱신
            likes: [...old.data.likes, { userId: userId } as Likes],
          },
        };
      });

      return { previousLp };
    },

    // 2. [성공] 서버가 준 '진짜 데이터'로 갈아끼우기 (재요청 X)
    onSuccess: (data: ResponseLikeLpDto, variables, context) => {
      // data: 서버에서 응답받은 진짜 좋아요 객체 (id, userId, lpId 등 포함)
      
      queryClient.setQueryData([QUERY_KEY.lps, variables.lpId], (old: any) => {
        if (!old) return old;
        
        // 아까 onMutate에서 넣은 '가짜'는 빼고, '진짜'를 넣어야 하지만
        // UI상으로는 어차피 똑같으므로, 여기서는 아무것도 안 하거나
        // 확실하게 하기 위해 서버 응답 데이터로 likes 배열을 다시 구성할 수도 있음.
        
        // 가장 간단한 해결책:
        // 성공했으면 재요청(invalidate) 하지 말고 그냥 둔다. 
        // 이미 onMutate에서 UI는 업데이트 되었으니까!
        return old; 
      });
    },

    // 3. [실패] 에러 나면 롤백 (원상복구)
    onError: (error, variables, context) => {
      console.error("좋아요 실패:", error); // 에러 로그 확인용
      if (context?.previousLp) {
        queryClient.setQueryData(
          [QUERY_KEY.lps, variables.lpId],
          context.previousLp
        );
      }
    },
    
    // 4. onSettled 삭제 (중요!)
    // 여기서 invalidateQueries를 하면 서버 데이터가 갱신되기 전에 가져와서 
    // 도로 하얀색이 될 수 있음. 당분간 주석 처리!
    // onSettled: ... 
  });
}

export default usePostLike;