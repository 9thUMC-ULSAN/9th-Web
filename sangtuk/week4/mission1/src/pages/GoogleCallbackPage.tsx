import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AuthTokens } from '../types/auth.types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setAuthTokens] = useLocalStorage<AuthTokens | null>('authTokens', null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name');

    if (accessToken && refreshToken) {
      // 토큰 저장
      setAuthTokens({
        accessToken,
        refreshToken,
      });

      // 홈으로 이동
      alert(`${name}님 환영합니다!`);
      navigate('/', { replace: true });
    } else {
      // 토큰이 없으면 로그인 페이지로
      alert('로그인에 실패했습니다.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setAuthTokens]);

  return (
    <div className="flex justify-center items-center h-dvh">
      <LoadingSpinner />
    </div>
  );
}
