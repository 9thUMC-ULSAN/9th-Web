import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLikeLpDto } from "../../types/lp.ts";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data: ResponseLikeLpDto) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
  });
}

export default useDeleteLike;