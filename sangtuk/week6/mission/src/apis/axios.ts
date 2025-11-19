import axios from 'axios';
import { 
  getAuthTokens, 
  setAuthTokens, 
  removeAuthTokens,
  getAccessToken 
} from '../utils/storage';

// API 베이스 URL (환경 변수에서 가져오기)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// 요청 인터셉터: 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = getAuthTokens();
        if (tokens?.refreshToken) {
          // 토큰 갱신 요청
          const response = await axios.post(
            `${API_BASE_URL}/v1/auth/refresh`,
            { refresh: tokens.refreshToken }
          );

          if (response.data.data?.accessToken) {
            const newTokens = {
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
            };
            setAuthTokens(newTokens);

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        console.error('Token refresh failed:', refreshError);
        removeAuthTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 기타 에러 처리
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('No response:', error.request);
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
