import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

export default function useDeleteComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`/v1/comments/${commentId}`);
    },
    onSuccess: () => {
      // ✅ 삭제 성공 시 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] });
    },
  });
}
