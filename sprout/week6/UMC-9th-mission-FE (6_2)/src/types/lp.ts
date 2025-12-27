import type { CursorBasedResponse } from './common.ts';

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

// [추가] 작성자(Writer) 타입 정의
export type Writer = {
  id?: number;
  nickname: string;
  profileImage?: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];

  // [수정] 작성자 정보 추가 (API 응답에 포함된다고 가정)
  writer?: Writer;
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
