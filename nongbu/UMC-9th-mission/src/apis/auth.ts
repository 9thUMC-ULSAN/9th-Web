import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios"; // axiosInstance가 설정되어 있다고 가정

export const postSignup = async (body: RequestSignupDto): Promise<RequestSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);
  return data;
};

/**
 * 로그인 요청
 * API 계층은 localStorage 조작을 책임지지 않는다.
 * 응답 데이터를 그대로 반환하며, Context가 스토리지/상태를 관리한다.
 */
export const postSignin = async (body: RequestSigninDto) => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data; // 응답 데이터( { data: { accessToken: ... } } )를 반환
};

/**
 * 로그아웃 (401 오류 수정)
 * 헤더에 Authorization 토큰을 추가해야 한다.
 */
export const postLogout = async() => {
  // 1. 스토리지에서 토큰을 읽어온다.
  let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (!token) throw new Error("로그아웃: 토큰이 없습니다.");

  // 2. 스토리지에 ""가 포함된 JSON 문자열로 저장되었다면 제거
  token = token.replace(/^"|"$/g, "");

  // 3. 헤더에 토큰을 담아 요청
  const { data } = await axiosInstance.post(
    "/v1/auth/signout",
    {}, // body가 없는 경우
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return data;
}

/**
 * 내 정보 조회 (제공된 코드)
 */
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (!token) throw new Error("토큰이 없습니다.");

  // 스토리지에 ""가 포함된 JSON 문자열로 저장되었다면 제거
  token = token.replace(/^"|"$/g, "");
  const { data } = await axiosInstance.get("/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(data)
  return data;
};