import axios from 'axios';
import type { SignInResponse, SignUpResponse } from '../types/auth.types';
import type { LoginFormData, SignupFormData } from '../schemas/auth.schema';

// API 베이스 URL (환경 변수에서 가져오기)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Axios 인스턴스 생성
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/v1/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 추가
authApi.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('authTokens');
    if (tokens) {
      const { accessToken } = JSON.parse(tokens);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 갱신 처리
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('authTokens');
        if (tokens) {
          const { refreshToken } = JSON.parse(tokens);

          // 토큰 갱신 요청
          const response = await axios.post<SignInResponse>(
            `${API_BASE_URL}/v1/auth/refresh`,
            { refresh: refreshToken }
          );

          if (response.data.data?.accessToken) {
            const newTokens = {
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
            };
            localStorage.setItem('authTokens', JSON.stringify(newTokens));

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return authApi(originalRequest);
          }
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('authTokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 회원가입 API
 */
export const signup = async (data: SignupFormData): Promise<SignUpResponse> => {
  // 이메일 앞부분을 name으로 사용 (서버가 name 필수 필드로 요구)
  const name = data.email.split('@')[0];

  const response = await authApi.post<SignUpResponse>('/signup', {
    name,
    email: data.email,
    password: data.password,
  });
  return response.data;
};

/**
 * 로그인 API
 */
export const login = async (data: LoginFormData): Promise<SignInResponse> => {
  const response = await authApi.post<SignInResponse>('/signin', data);
  return response.data;
};

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await authApi.post('/signout');
  localStorage.removeItem('authTokens');
};

/**
 * 토큰 갱신 API
 */
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/refresh', { refreshToken });
  return response.data;
};

export default authApi;
