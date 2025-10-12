import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../schemas/auth.schema';
import { signup } from '../api/auth.api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AuthTokens } from '../types/auth.types';
import '../styles/auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [, setAuthTokens] = useLocalStorage<AuthTokens | null>('authTokens', null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [signupError, setSignupError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const email = watch('email');
  const password = watch('password');
  const passwordCheck = watch('passwordCheck');

  // 회원가입 제출
  const onSubmit = async (data: SignupFormData) => {
    try {
      setSignupError('');
      console.log('📤 전송할 데이터:', data);
      const response = await signup(data);
      console.log('✅ 서버 응답:', response);

      if (response.status && response.data) {
        // 회원가입 성공 - 로그인 페이지로 이동
        alert(`회원가입이 완료되었습니다! ${response.data.name}님 환영합니다.`);
        navigate('/login');
      } else {
        setSignupError(response.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      console.error('❌ 에러 상세:', error.response?.data);
      setSignupError(
        error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-step">
            {/* 이메일 */}
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                {...register('email')}
                className={errors.email ? 'input-error' : ''}
                autoFocus
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
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

            <div className="form-group">
              <label htmlFor="passwordCheck">비밀번호 확인</label>
              <div className="password-input-wrapper">
                <input
                  id="passwordCheck"
                  type={showPasswordCheck ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력해주세요"
                  {...register('passwordCheck')}
                  className={errors.passwordCheck ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                  aria-label={
                    showPasswordCheck ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  {showPasswordCheck ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.passwordCheck && (
                <p className="error-message">{errors.passwordCheck.message}</p>
              )}
            </div>

            {/* 서버 에러 메시지 */}
            {signupError && (
              <div className="server-error-message">{signupError}</div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '회원가입 중...' : '회원가입'}
            </button>

            {/* 구분선 */}
            <div className="divider">
              <span>또는</span>
            </div>

            {/* 구글 로그인 버튼 */}
            <button
              type="button"
              onClick={() => {
                window.location.href = 'http://localhost:8000/v1/auth/google/login';
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
              Google로 계속하기
            </button>
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="link-button"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
