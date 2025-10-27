import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<RequestSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto) => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  let token = data.data.accessToken;

  localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(token));

  console.log(token)
  console.log(localStorage.getItem(LOCAL_STORAGE_KEY.accessToken))
  return data;
};

//mypage
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (!token) throw new Error("토큰이 없습니다.");


  token = token.replace(/^"|"$/g, "");
  const { data } = await axiosInstance.get("/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(data)
  return data;
};

