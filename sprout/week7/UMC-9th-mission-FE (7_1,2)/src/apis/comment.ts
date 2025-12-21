import { axiosInstance } from './axios.ts';
import type { PaginationDto } from '../types/common.ts';
import type { ResponseCommentListDto } from '../types/comment.ts';

// 댓글 목록 조회 (LP ID 필수)
export const getCommentList = async (
  lpId: number,
  paginationDto: PaginationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });
  return data;
};
