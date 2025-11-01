import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth"; // 가정
import { LOCAL_STORAGE_KEY } from "../constants/key"; // 가정
import { useLocalStorage } from "../hooks/useLocalStorage"; // 가정
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>({
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

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const login = async (signInData: RequestSigninDto) => {
    try {
      // 1. API 호출
      const response = await postSignin(signInData);

      // 2. 응답 구조 (data.data.accessToken) 확인
      if (response && response.data && response.data.accessToken) {
        const newAccessToken: string = response.data.accessToken;

        // 3. 스토리지 저장 (useLocalStorage 훅이 JSON.stringify 처리 가정)
        setAccessTokenInStorage(newAccessToken);

        // 4. React 상태 업데이트
        setAccessToken(newAccessToken);

        alert("로그인 성공");
        window.location.href = "/my";
      } else {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  // 401 오류에 대응하는 견고한 로그아웃
  const logout = async () => {
    try {
      // 1. 서버에 로그아웃 요청 (수정된 postLogout 호출)
      await postLogout();
    } catch (error) {
      // 2. API가 401(토큰 만료) 등으로 실패해도, 콘솔에만 기록
      console.error("로그아웃 API 오류 (클라이언트 로그아웃은 계속 진행):", error);
    } finally {
      // 3. API 성공/실패와 관계없이 무조건 클라이언트 상태 정리
      try {
        removeAccessTokenFromStorage();
        setAccessToken(null);

        alert("로그아웃 되었습니다.");
        window.location.href = "/"; // 홈으로 이동
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
    throw new Error("AuthContext를 찾을 수 없습니다. AuthProvider로 감싸주세요.");
  }
  return context;
};