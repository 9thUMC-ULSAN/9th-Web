import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseCustomFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching data with automatic refetch on URL change
 * @param url - The URL to fetch data from
 * @returns Object containing data, loading state, and error state
 */
export function useCustomFetch<T>(url: string | null): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL이 null이면 요청하지 않음
    if (!url) {
      return;
    }

    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.status_message || err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]); // URL이 변경될 때마다 자동으로 재요청

  return { data, isLoading, error };
}

