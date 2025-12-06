import { useMutation } from "@tanstack/react-query";
import type { RequestLpDto, ResponseLikeLpDto, Likes, ResponseLpDto } from "../../types/lp";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import type { ResponseMyInfoDto } from "../../types/auth";

// userId 추가된 타입
type PostLikeVariables = RequestLpDto & { userId: number };

function usePostLike() {
  return useMutation({
    mutationFn: (lp: RequestLpDto) => postLike(lp),
    onMutate: async (lp: RequestLpDto) => {
      // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져와야 함
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
          QUERY_KEY.lps,
          lp.lpId,
        ,
      ]);

      // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만들것 
      // 복사하는 가장 큰 이유는 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서
      const newLpPost = { ...previousLpPost };

      // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야함
      const me: ResponseMyInfoDto | undefined = queryClient.getQueryData<ResponseMyInfoDto>([
          QUERY_KEY.myInfo,
      ]);
      const userId: number = Number(me?.data.id);

      const likedIndex: number =
        previousLpPost?.data.likes.findIndex(
          (like: Likes) => like.userId === userId,
        ) ?? -1;

      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId:lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }
      // 업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게하면 UI가 바로 업데이트 됨, 사용자가 변화를 확인할 수 있다.
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

      return { previousLpPost, newLpPost}
    },

    onError: (err: Error, newLp: RequestLpDto, context: { previousLpPost: ResponseLpDto | undefined } | undefined) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost,
      );
    },

    // onSettled는 API 요청이 끝난후 (성공하든 실패하든 실행)
    onSettled: async (data, error, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
      });
    },
  });
}

export default usePostLike;