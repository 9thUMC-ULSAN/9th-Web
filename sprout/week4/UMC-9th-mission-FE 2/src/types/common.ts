export type CommonResponse<T> = {
  status: string;
  statusCode: number;
  message: string;
  data: T;
};
