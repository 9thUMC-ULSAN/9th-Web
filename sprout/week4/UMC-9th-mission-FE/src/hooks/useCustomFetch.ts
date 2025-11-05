import { useState, useEffect, useCallback } from 'react';

// API 응답의 기본 구조를 위한 인터페이스 (제네릭 T)
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // 재요청 함수 추가
}

/**
 * 영화 데이터 API를 호출하고 상태(데이터, 로딩, 에러)를 관리하는 Custom Hook
 * (axios 대신 내장된 fetch API 사용)
 * @param url 요청할 API 엔드포인트 URL
 * @param params 추가적인 의존성 배열 요소 (선택 사항)
 * @returns {data, loading, error, refetch}
 */
function useCustomFetch<T>(url: string, params: any[] = []): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // 재요청 트리거

  // URL 및 기타 의존성이 변경될 때마다 데이터를 가져오는 함수
  const fetchData = useCallback(async () => {
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
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TMDB_KEY}`,
        },
      });

      if (!response.ok) {
        // HTTP 상태 코드가 200 범위가 아닌 경우 에러 처리
        const errorBody = await response.json().catch(() => ({}));
        let errorMessage = `API 요청 실패: ${response.status} ${response.statusText}`;

        if (errorBody.status_message) {
            errorMessage += ` (${errorBody.status_message})`;
        }
        
        throw new Error(errorMessage);
      }

      const responseData: T = await response.json();
      setData(responseData);

    } catch (err) {
      console.error('API Fetch Failed:', err);

      let errorMessage = '데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.';
      if (err instanceof Error) {
        // 네트워크 에러 또는 response.ok에서 발생시킨 에러
        errorMessage = err.message;
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

  // 재요청 함수
  const refetch = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}

export default useCustomFetch;