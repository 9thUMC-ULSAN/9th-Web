import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

// 인증 상태 타입 정의
interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (userInfo: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// 초기 값
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props 타입 정의
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태 // 🚨 [수정]: Access Token과 Refresh Token의 removeItem을 모두 가져와야 합니다.

  const { getItem: getLocalAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  ); // 로그아웃 시 Access Token 삭제 함수

  const { removeItem: removeLocalAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  ); // 🚨 [수정 추가]: Refresh Token 삭제 함수
  const { removeItem: removeLocalRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  ); // 1. 컴포넌트 마운트 시 로컬 스토리지에서 토큰을 확인하여 초기 상태 설정

  useEffect(() => {
    const token = getLocalAccessToken(); // Access Token 확인
    if (token) {
      setAccessToken(token);
    } // 토큰 확인 후 로딩 완료 처리
    setIsLoading(false);
  }, [getLocalAccessToken]); // 로그인 함수: 로컬 스토리지에서 토큰을 읽어와 상태를 업데이트합니다.

  const login = async () => {
    // LoginPage에서 setItem(token)을 호출한 후 호출되므로,
    // 여기서 토큰을 다시 읽어와 상태를 동기화합니다.
    const token = getLocalAccessToken();
    if (token) {
      setAccessToken(token);
    } // 이 Promise.resolve()는 외부에서 login 작업이 완료되었음을 알리는 역할을 합니다.
    return Promise.resolve();
  }; // 로그아웃 함수

  const logout = async () => {
    // 1. 서버에 로그아웃 요청 (필요하다면 postlogout() 호출)

    // 2. Context 상태 초기화
    setAccessToken(null); // 🚨 [수정]: Access Token과 Refresh Token 모두 로컬 스토리지에서 삭제

    removeLocalAccessToken();
    removeLocalRefreshToken();

    return Promise.resolve();
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {/* 로딩이 완료된 후에만 자식 컴포넌트를 렌더링합니다. */}{' '}
      {!isLoading && children} {/* 로딩 중 메시지 (옵션) */}{' '}
      {isLoading && (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          인증 정보를 불러오는 중입니다...{' '}
        </div>
      )}{' '}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
