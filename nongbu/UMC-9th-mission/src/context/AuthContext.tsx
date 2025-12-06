import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { RequestSigninDto } from "../types/auth"; // 가정
import { LOCAL_STORAGE_KEY } from "../constants/key"; // 가정
import { useLocalStorage } from "../hooks/useLocalStorage"; // 가정
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext: React.Context<AuthContextType> =
  createContext<AuthContextType>({
    accessToken: null,
    login: async () => {},
    logout: async () => {},
  });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  // --- [수정 1] ---
  // refreshToken 저장을 위한 useLocalStorage 훅 추가
  const {
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  // --- [수정 1 끝] ---

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const login = async (signInData: RequestSigninDto) => {
    try {
      const response = await postSignin(signInData);

      // --- [수정 2] ---
      // 서버 응답에 accessToken과 refreshToken이 모두 있는지 확인
      // (서버 응답 DTO에 refreshToken이 포함되어 있다고 가정)
      if (
        response &&
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        const newAccessToken: string = response.data.accessToken;
        const newRefreshToken: string = response.data.refreshToken; // refreshToken 추출

        // --- [수정 3] ---
        // 두 토큰 모두 스토리지에 저장
        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken); // refreshToken 저장
        // --- [수정 3 끝] ---

        setAccessToken(newAccessToken);

        alert("로그인 성공");
        window.location.href = "/my";
      } else {
        throw new Error(
          "로그인 응답 형식이 올바르지 않습니다. (토큰 누락)"
        );
      }
      // --- [수정 2 끝] ---
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error(
        "로그아웃 API 오류 (클라이언트 로그아웃은 계속 진행):",
        error
      );
    } finally {
      try {
        // --- [수정 4] ---
        // 로그아웃 시 두 토큰 모두 스토리지에서 삭제
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage(); // refreshToken 삭제
        // --- [수정 4 끝] ---

        setAccessToken(null);

        alert("로그아웃 되었습니다.");
        window.location.href = "/";
      } catch (cleanupError) {
        console.error("클라이언트측 로그아웃 처리 중 오류:", cleanupError);
        alert("로그아웃 처리에 실패했습니다.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 커스텀 훅
export const useAuth = () => {
  const context: AuthContextType = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "AuthContext를 찾을 수 없습니다. AuthProvider로 감싸주세요."
    );
  }
  return context;
};
