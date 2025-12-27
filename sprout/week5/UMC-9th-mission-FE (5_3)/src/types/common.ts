export type CommonResponse<T> = {
  status: boolean; // 💡 [수정] string에서 boolean으로 변경했습니다.
  statusCode: number;
  message: string;
  data: T;
};
