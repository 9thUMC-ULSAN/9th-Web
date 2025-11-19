import { useLocalStorage } from './useLocalStorage';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증 토큰을 관리하는 커스텀 훅
 * localStorage에 토큰을 저장하고 관리합니다.
 */
export function useAuthToken() {
  const [tokens, setTokens, removeTokens] = useLocalStorage<AuthTokens | null>(
    'authTokens',
    null
  );

  /**
   * 토큰 저장
   */
  const saveTokens = (accessToken: string, refreshToken: string) => {
    setTokens({ accessToken, refreshToken });
  };

  /**
   * 액세스 토큰만 업데이트
   */
  const updateAccessToken = (accessToken: string) => {
    if (tokens) {
      setTokens({ ...tokens, accessToken });
    }
  };

  /**
   * 토큰 제거 (로그아웃)
   */
  const clearTokens = () => {
    removeTokens();
  };

  /**
   * 토큰 존재 여부
   */
  const hasTokens = !!tokens?.accessToken;

  return {
    tokens,
    accessToken: tokens?.accessToken,
    refreshToken: tokens?.refreshToken,
    saveTokens,
    updateAccessToken,
    clearTokens,
    hasTokens,
  };
}
