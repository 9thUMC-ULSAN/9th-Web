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

// 로그아웃 API (AuthContext에서 사용)
export const postlogout = async () => {
  // 실제 서버에 토큰 무효화를 알리는 요청입니다.
  await axiosInstance.post('v1/auth/signout');
  console.log('Logout API call simulated (Actual endpoint hit).');
  // 서버가 204 No Content를 반환할 수 있으므로, 응답 데이터를 반환하지 않습니다.
};
