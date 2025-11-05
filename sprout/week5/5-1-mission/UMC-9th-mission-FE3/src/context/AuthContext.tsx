// src/context/AuthContext.tsx

import type { RequestSigninDto, ResponseSigninDto } from '../types/auth';
import type { PropsWithChildren } from 'react';
import { createContext, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { postSignin, postSignout } from '../apis/auth';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

export const AuthContext: React.Context<AuthContextType> =
  createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
    isLoggedIn: false,
  });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // Local Storage Hooks 설정
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getAccessTokenFromStorage()
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    getRefreshTokenFromStorage()
  );

  const isLoggedIn = !!accessToken;

  const login = async (data: RequestSigninDto) => {
    try {
      const signinData: ResponseSigninDto = await postSignin(data);

      const newAccessToken = signinData.accessToken;
      const newRefreshToken = signinData.refreshToken;

      // Local Storage에 저장
      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);

      // State 업데이트
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      alert('로그인 성공');
    } catch (error) {
      console.error('로그인 오류', error);
      alert('로그인 실패');
    }
  };

  const logout = async () => {
    try {
      await postSignout();

      // Local Storage에서 제거
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      // State 초기화
      setAccessToken(null);
      setRefreshToken(null);

      alert('로그아웃 성공');
    } catch (error) {
      console.error(error);
      alert('로그아웃 실패');
    }
  };

  const value: AuthContextType = {
    accessToken,
    refreshToken,
    login,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext를 찾을 수 없습니다.');
  

  return context;
};
