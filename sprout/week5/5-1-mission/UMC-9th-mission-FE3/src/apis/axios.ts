// src/apis/axios.ts

import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

// 환경 변수에서 API 기본 URL을 사용합니다.
const BASE_URL = import.meta.env.VITE_API_URL;

// Axios 인스턴스 생성 및 기본 설정
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// --- 요청 인터셉터 (Request Interceptor) ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터 (Response Interceptor) ---
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 에러 처리 로직
    }

    return Promise.reject(error);
  }
);
