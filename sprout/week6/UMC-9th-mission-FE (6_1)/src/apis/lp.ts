import type { PaginationDto } from '../types/common.ts';
import { axiosInstance } from './axios.ts';
import type { ResponseLpListDto, Lp } from '../types/lp.ts';

// =================================================================
// [조회 관련]
// =================================================================

// 1. 목록 조회
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get('/v1/lps', {
    params: paginationDto,
  });

  return data;
};

// 2. 상세 조회
export const getLpDetail = async (id: number): Promise<Lp> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};

// =================================================================
// [기능 관련: 수정, 삭제, 좋아요]
// =================================================================

// 3. 수정 (Update)
// 제목과 내용만 수정한다고 가정하고 타입을 정의했습니다.
export const updateLp = async (
  id: number,
  body: { title: string; content: string }
): Promise<void> => {
  // PATCH: /v1/lps/:id
  await axiosInstance.patch(`/v1/lps/${id}`, body);
};

// 4. 삭제 (Delete)
export const deleteLp = async (id: number): Promise<void> => {
  // DELETE: /v1/lps/:id
  await axiosInstance.delete(`/v1/lps/${id}`);
};

// 5. 좋아요 (Like) - 추가
export const postLpLike = async (id: number): Promise<void> => {
  // POST: /v1/lps/:id/likes
  await axiosInstance.post(`/v1/lps/${id}/likes`);
};

// [✅ 추가된 코드]
// 6. 좋아요 취소 (Unlike) - 삭제
export const deleteLpLike = async (id: number): Promise<void> => {
  // DELETE: /v1/lps/:id/likes
  await axiosInstance.delete(`/v1/lps/${id}/likes`);
};
