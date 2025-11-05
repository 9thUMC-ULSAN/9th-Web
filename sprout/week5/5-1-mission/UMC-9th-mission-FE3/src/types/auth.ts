// Request DTOs
export interface RequestSignupDto {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
}

export interface RequestSigninDto {
  email: string;
  password: string;
}

// Response DTOs
export interface ResponseMyInfoDto {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseSigninDto {
  accessToken: string;
  refreshToken: string;
}

export interface ResponseSignupDto {
  id: number;
  name: string;
  email: string;
  // ... 기타 필요한 응답 필드
}
