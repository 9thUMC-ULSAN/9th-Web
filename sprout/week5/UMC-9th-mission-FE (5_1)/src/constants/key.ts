// key.ts 파일 수정 (타입 선언 부분 제거)
export const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken', // TypeScript가 { accessToken: string, refreshToken: string } 타입으로 자동 추론합니다.
};
