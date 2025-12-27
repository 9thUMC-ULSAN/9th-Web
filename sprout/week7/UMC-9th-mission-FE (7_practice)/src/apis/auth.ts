import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseSigninDto,
  ResponseSignupDto,
  ResponseMyInfoDto,
} from '../types/auth';
// axiosInstance는 이 파일 외부(예: axios.ts)에 정의되어 있다고 가정합니다.
import { axiosInstance } from './axios';

// 회원가입 API
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post('v1/auth/signup', body);
  return data;
};

// 로그인 API
export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post('v1/auth/signin', body);
  return data;
};

// 내 정보 조회 API (MyPage에서 사용)
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  // [axios.ts의 Interceptor 덕분에] 토큰이 헤더에 실려 전송됩니다.
  const { data } = await axiosInstance.get('v1/users/me');
  return data;
};

export const postlogout = async () => {
  const { data } = await axiosInstance.post('v1/auth/signout');

  return data;
};
