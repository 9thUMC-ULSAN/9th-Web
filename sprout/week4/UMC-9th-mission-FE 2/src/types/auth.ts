import type { CommonResponse } from './common';

// RequestSignupDto: 회원가입 요청 시 서버로 보내는 데이터
export type RequestSignupDto = {
  name: string;
  email: string;
  bio?: string;
  avator?: string;
  password: string;
};

// ResponseSignupDto: 회원가입 성공 시 서버에서 받는 응답 데이터
export type ResponseSignupDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avator: string | null;
  createdAt: Date;
  updatedAt: Date;
}>; // <--- 여기 중괄호를 닫았습니다.

// RequestSigninDto: 로그인 요청 시 서버로 보내는 데이터
export type RequestSigninDto = {
  email: string;
  password: string;
};

// ResponseSigninDto: 로그인 성공 시 서버에서 받는 응답 데이터 (토큰 포함)
export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

// ResponseMyInfoDto: 내 정보 조회 응답 데이터
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avator: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;
