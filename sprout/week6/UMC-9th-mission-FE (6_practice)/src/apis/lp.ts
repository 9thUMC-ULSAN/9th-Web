import type { PaginationDto } from '../types/common.ts';
import { axiosInstance } from '../apis/axios.ts';
import type { ResponseLpListDto } from '../types/lp.ts';

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get('/v1/lps', {
    params: paginationDto,
  });

  return data;
};
