import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { login } from '../api/auth.api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AuthTokens } from '../types/auth.types';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [, setAuthTokens] = useLocalStorage<AuthTokens | null>('authTokens', null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      const response = await login(data);

      if (response.status && response.data?.accessToken && response.data?.refreshToken) {
        // 토큰 저장
        setAuthTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        // 홈으로 이동
        navigate('/');
      } else {
        setLoginError(response.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(
        error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* 이메일 입력 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                {...register('password')}
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* 로그인 에러 메시지 */}
          {loginError && (
            <div className="server-error-message">{loginError}</div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="divider">
          <span>또는</span>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          type="button"
          onClick={() => {
            window.location.href = 'http://localhost:8000/v1/auth/google/callback';
          }}
          className="google-login-button"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 로그인
        </button>

        {/* 회원가입 링크 */}
        <div className="auth-footer">
          <p>
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="link-button"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
