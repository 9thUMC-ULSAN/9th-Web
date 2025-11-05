// TS(1484) 오류 해결: import에 'type' 키워드 추가
import type {
  RequestSignupDto,
  ResponseSigninDto,
  RequestSigninDto,
  ResponseSignupDto,
  ResponseMyInfoDto,
} from '../types/auth';
import { axiosInstance } from '../apis/axios'; // axiosInstance 경로 수정 (apis 폴더 내부)

// 회원가입 (Sign up) API 호출
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post('/v1/auth/signup', body);

  return data;
};

// 로그인 (Sign in) API 호출
export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post('/v1/auth/signin', body);

  return data;
};

// 로그아웃 (Sign out) API 호출
export const postSignout = async () => {
  const { data } = await axiosInstance.post('/v1/auth/signout');

  return data;
};

// 내 정보 조회 (My Info) API 호출
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  // 실제 백엔드 API 경로에 맞게 수정
  const { data } = await axiosInstance.get('/v1/users/me');

  return data;
};
