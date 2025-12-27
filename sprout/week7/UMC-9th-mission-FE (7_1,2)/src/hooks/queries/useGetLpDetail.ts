// src/hooks/queries/useGetLpDetail.ts
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios'; // 기존 인스턴스 사용
import type { ResponseLpDto } from '../../types/lp';

interface UseGetLpDetailProps {
  lpId: number;
}

const useGetLpDetail = ({ lpId }: UseGetLpDetailProps) => {
  return useQuery<ResponseLpDto>({
    queryKey: ['lpDetail', lpId],
    queryFn: async () => {
      // ✅ 백엔드 API 관례에 맞춰 /v1/lps/ 사용
      const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
      return data;
    },
    enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
  });
};

export default useGetLpDetail;
