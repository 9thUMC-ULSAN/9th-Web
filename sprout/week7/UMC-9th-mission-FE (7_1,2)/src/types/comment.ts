import type { CursorBasedResponse } from './common.ts';
import type { Writer } from './lp.ts'; // lp.ts에 정의된 Writer 재사용

export type Comment = {
  id: number;
  content: string;
  createdAt: string | Date;
  writer: Writer; // 작성자 정보
};

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;
