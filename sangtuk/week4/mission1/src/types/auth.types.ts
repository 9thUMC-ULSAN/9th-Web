export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInData {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: UserData;
}

export interface SignInResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: SignInData;
}
