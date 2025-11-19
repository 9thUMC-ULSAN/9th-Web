/**
 * LocalStorage 유틸리티 함수들
 * axios interceptor 등 React 컴포넌트가 아닌 곳에서 사용
 */

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const AUTH_TOKENS_KEY = 'authTokens';

/**
 * 로컬 스토리지에서 토큰 가져오기
 */
export const getAuthTokens = (): AuthTokens | null => {
  try {
    const tokens = localStorage.getItem(AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Failed to parse authTokens:', error);
    return null;
  }
};

/**
 * 로컬 스토리지에 토큰 저장
 */
export const setAuthTokens = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save authTokens:', error);
  }
};

/**
 * 로컬 스토리지에서 토큰 제거
 */
export const removeAuthTokens = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKENS_KEY);
  } catch (error) {
    console.error('Failed to remove authTokens:', error);
  }
};

/**
 * 액세스 토큰만 가져오기
 */
export const getAccessToken = (): string | null => {
  const tokens = getAuthTokens();
  return tokens?.accessToken || null;
};

/**
 * 리프레시 토큰만 가져오기
 */
export const getRefreshToken = (): string | null => {
  const tokens = getAuthTokens();
  return tokens?.refreshToken || null;
};
