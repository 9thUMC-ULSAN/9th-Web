import { useState, useEffect, useCallback } from 'react';
import axios, { type AxiosError } from 'axios';

// API 요청 응답의 기본 구조를 위한 인터페이스 (제네릭 T)
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // 재요청 함수 추가
}

/**
 * 영화 데이터 API를 호출하고 상태(데이터, 로딩, 에러)를 관리하는 Custom Hook
 * @param url 요청할 API 엔드포인트 URL
 * @param params URL에 포함되지 않은 추가적인 의존성 배열 요소 (선택 사항)
 * @returns {data, loading, error, refetch}
 */
function useCustomFetch<T>(url: string, params: any[] = []): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // 재요청 트리거

  // URL 및 기타 의존성이 변경될 때마다 데이터를 가져오는 함수
  const fetchData = useCallback(async () => {
    // URL이 비어있으면 요청하지 않습니다.
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // 환경 변수에서 TMDB 키를 가져옵니다.
    const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
    if (!TMDB_KEY) {
      setError('⚠️ API 키(VITE_TMDB_KEY)가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    try {
      const { data: responseData } = await axios.get<T>(url, {
        headers: {
          Authorization: `Bearer ${TMDB_KEY}`,
        },
      });

      setData(responseData);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error('API Fetch Failed:', axiosError);

      let errorMessage = '데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.';
      if (axiosError.response) {
        // 서버 응답 에러 (4xx, 5xx)
        errorMessage = `API 요청 실패: ${axiosError.response.status} ${axiosError.response.statusText}`;
      } else if (axiosError.request) {
        // 네트워크 에러
        errorMessage = '네트워크 연결 상태를 확인해 주세요.';
      }

      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, retryCount, ...params]); // URL과 params, 재시도 카운트를 의존성에 포함

  useEffect(() => {
    // 컴포넌트 마운트 및 의존성 변경 시 fetchData 호출
    fetchData();
  }, [fetchData]);

  // 재요청 함수 (외부에서 호출하여 데이터를 다시 가져올 수 있도록)
  const refetch = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}

export default useCustomFetch;
