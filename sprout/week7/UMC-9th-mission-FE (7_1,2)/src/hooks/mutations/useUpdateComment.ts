import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

export default function useUpdateComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const { data } = await axiosInstance.patch(`/v1/comments/${commentId}`, {
        content,
      });
      return data;
    },
    onSuccess: () => {
      // ✅ 수정 성공 시 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] });
    },
  });
}
