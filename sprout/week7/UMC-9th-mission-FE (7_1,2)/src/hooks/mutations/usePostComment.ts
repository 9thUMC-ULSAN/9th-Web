import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

export default function usePostComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      // ✅ 서버 API 주소와 데이터 구조를 확인하세요
      const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
      });
      return data;
    },
    onSuccess: () => {
      // ✅ 가이드라인: 댓글 목록 queryKey를 무효화하여 즉시 반영
      queryClient.invalidateQueries({ queryKey: ['comments', lpId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    },
  });
}
