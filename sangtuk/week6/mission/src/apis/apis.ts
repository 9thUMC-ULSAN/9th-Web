// 1. 필요한 타입 (DTOs) 정의

// 회원가입 요청/응답 타입
export interface RequestSignupDto {
  [key: string]: any;
}

export interface ResponseSignupDto {
  [key: string]: any;
}

// 로그인 요청/응답 타입
export interface RequestSigninDto {
  [key: string]: any;
}

export interface ResponseSigninDto {
  [key: string]: any;
}

// 사용자 정보 응답 타입
export interface ResponseMyInfoDto {
  [key: string]: any;
}

// ============= LP 관련 타입 =============

// LP 작성자 타입
export interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

// 댓글 목록 응답 타입
export interface CommentListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

// LP 타입
export interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: Author;
  tags: string[];
  likes: any[];
}

// LP 목록 응답 타입
export interface LPListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: LP[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

// LP 상세 응답 타입
export interface LPDetailResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: LP;
}

// 커서 페이지네이션 파라미터
export interface CursorPaginationParams {
  limit?: number;  // 백엔드는 'limit'을 사용
  cursor?: number;
  search?: string;
  order?: 'asc' | 'desc';
}

// 2. Axios 인스턴스 import
import axiosInstance from './axios';


// 3. API 호출 함수 정의

/**
 * 회원가입 (Sign Up) 요청
 */
export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post<ResponseSignupDto>(
    '/v1/auth/signup',
    body
  );
  return data;
};

/**
 * 로그인 (Sign In) 요청
 */
export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post<ResponseSigninDto>(
    '/v1/auth/signin',
    body
  );
  return data;
};

/**
 * 사용자 정보 (My Info) 요청
 */
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get<ResponseMyInfoDto>('/v1/users/me');
  return data;
};

/**
 * 로그아웃 (Sign Out) 요청
 */
export const postLogout = async (): Promise<any> => {
  const { data } = await axiosInstance.post('/v1/auth/signout');
  return data;
};

// ============= LP 관련 API 함수 =============

/**
 * LP 목록 조회 (커서 기반 페이지네이션)
 * @param params - take: 가져올 개수(기본 10), cursor: 페이지네이션 커서
 */
export const getLPs = async (
  params?: CursorPaginationParams
): Promise<LPListResponse> => {
  const { data } = await axiosInstance.get<LPListResponse>('/v1/lps', {
    params,
  });
  return data;
};

/**
 * LP 상세 조회
 * @param lpId - LP ID
 */
export const getLPDetail = async (lpId: number): Promise<LPDetailResponse> => {
  const { data } = await axiosInstance.get<LPDetailResponse>(`/v1/lps/${lpId}`);
  return data;
};

/**
 * 특정 유저가 생성한 LP 목록 조회
 * @param userId - 유저 ID
 * @param params - 페이지네이션 파라미터
 */
export const getUserLPs = async (
  userId: number,
  params?: CursorPaginationParams
): Promise<LPListResponse> => {
  const { data } = await axiosInstance.get<LPListResponse>(
    `/v1/lps/user/${userId}`,
    { params }
  );
  return data;
};

/**
 * 특정 태그의 LP 목록 조회
 * @param tagName - 태그 이름
 * @param params - 페이지네이션 파라미터
 */
export const getLPsByTag = async (
  tagName: string,
  params?: CursorPaginationParams
): Promise<LPListResponse> => {
  const { data } = await axiosInstance.get<LPListResponse>(
    `/v1/lps/tag/${tagName}`,
    { params }
  );
  return data;
};

/**
 * 내가 생성한 LP 목록 조회 (인증 필요)
 * @param params - 페이지네이션 파라미터
 */
export const getMyLPs = async (
  params?: CursorPaginationParams
): Promise<LPListResponse> => {
  const { data } = await axiosInstance.get<LPListResponse>('/v1/lps/user', {
    params,
  });
  return data;
};

/**
 * 구글 로그인 URL 가져오기
 */
export const getGoogleLoginUrl = (): string => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseURL}/v1/auth/google/login`;
};

// ============= 댓글 관련 API 함수 =============

/**
 * LP의 댓글 목록 조회 (커서 기반 페이지네이션)
 * @param lpId - LP ID
 * @param params - 페이지네이션 및 정렬 파라미터
 */
export const getComments = async (
  lpId: number,
  params?: CursorPaginationParams
): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get<CommentListResponse>(
    `/v1/lps/${lpId}/comments`,
    { params }
  );
  return data;
};

/**
 * 댓글 작성
 * @param lpId - LP ID
 * @param content - 댓글 내용
 */
export const createComment = async (
  lpId: number,
  content: string
): Promise<any> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};
