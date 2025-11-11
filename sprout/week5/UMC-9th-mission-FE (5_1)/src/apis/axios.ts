import axios, { type AxiosInstance } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청(Request) Interceptor를 추가하여 모든 API 요청에 토큰을 동적으로 주입합니다.
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. 로컬 스토리지에서 Access Token의 문자열 값을 가져옵니다.
    const rawTokenData = window.localStorage.getItem(
      LOCAL_STORAGE_KEY.accessToken
    );

    let token: string | null = null; // 순수한 토큰 문자열을 저장할 변수

    if (rawTokenData) {
      try {
        // 2. [핵심 수정] JSON.parse를 사용하여 로컬 스토리지의 JSON 포맷을 제거하고
        //    순수한 토큰 문자열(string)을 얻습니다. (401 에러 해결 목표)
        const parsed = JSON.parse(rawTokenData);

        // 3. 파싱 결과가 유효한 문자열인지 확인합니다.
        if (typeof parsed === 'string' && parsed.length > 0) {
          token = parsed;
        } else {
          console.warn('토큰 데이터를 파싱한 후 형식이 올바르지 않습니다.');
        }
      } catch (e) {
        console.error('토큰 파싱 오류, 데이터가 손상되었을 수 있습니다.', e);
      }
    }

    // 4. 유효한 토큰이 있을 경우 Authorization 헤더에 주입합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
