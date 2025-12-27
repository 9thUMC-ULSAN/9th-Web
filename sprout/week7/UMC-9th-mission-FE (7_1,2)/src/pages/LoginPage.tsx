import { useState, type ReactElement, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; // ✅ useMutation 추가
import useForm from '../hooks/useForm';
import { type UserSigninInformation, validateSignin } from '../utils/validate';
import type { ResponseSigninDto } from '../types/auth';
import { postSignin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useAuth } from '../context/AuthContext';

// --- 아이콘 컴포넌트 ---
const EyeIcon = (props: {
  size: number;
  className?: string;
  onClick?: () => void;
}): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    onClick={props.onClick}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props: {
  size: number;
  className?: string;
  onClick?: () => void;
}): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    onClick={props.onClick}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.91 1.91 0 0 1 .53-1.89m-1.28-3C.95 9.4 2.89 7.42 5.09 6M9 11l4 4m6 1l-1.44-1.44M11.59 3.03A10.32 10.32 0 0 1 12 4c7 0 10 7 10 7a1.91 1.91 0 0 1-.53 1.89" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

// --- 메인 컴포넌트 ---
const LoginPage = (): ReactElement => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: '',
        password: '',
      },
      validate: validateSignin,
    });

  // 이미 로그인된 경우 처리
  useEffect(() => {
    if (accessToken) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/my';
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, location.state]);

  // ✅ [수정] 로그인 로직을 useMutation으로 구현
  const loginMutation = useMutation({
    mutationFn: (signinData: UserSigninInformation) => postSignin(signinData),
    onSuccess: (response: ResponseSigninDto) => {
      // 1. 토큰 저장
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);

      // 2. AuthContext 업데이트
      login(response.data);

      // 3. 홈 화면으로 리다이렉션
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/';
      navigate(from, { replace: true });

      console.log('로그인 성공:', response);
    },
    onError: (error: any) => {
      console.error('로그인 실패:', error.message || '알 수 없는 오류');
      alert(
        error.response?.data?.message ||
          '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      );
    },
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const isDisabled =
    Object.values(errors).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === '') ||
    loginMutation.isPending; // 로딩 중에도 버튼 비활성화

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_SERVER_API_URL;
    const separator = baseURL.endsWith('/') ? '' : '/';
    window.location.href = baseURL + separator + 'v1/auth/google/login';
  };

  const handleSubmit = () => {
    if (isDisabled) return;
    // ✅ 뮤테이션 실행
    loginMutation.mutate(values);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white min-h-screen pt-16">
      <div className="flex flex-col items-center p-8 bg-gray-900 rounded-xl shadow-2xl w-full max-w-md my-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={handleGoBack}
            className="text-white text-2xl p-1 hover:text-red-500 transition-colors"
            aria-label="뒤로 가기"
          >
            &lt;
          </button>
          <h2 className="text-3xl font-bold text-white">로그인</h2>
          <div className="w-8"></div>
        </div>

        {/* 이메일 입력 */}
        <div className="w-full mb-4">
          <input
            {...getInputProps('email')}
            className={`border w-full p-4 focus:outline-none rounded-md bg-gray-800 text-white placeholder-gray-500 transition-colors ${
              errors?.email && touched?.email
                ? 'border-red-600 ring-1 ring-red-600'
                : 'border-gray-700 focus:border-red-600'
            }`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors?.email && touched.email && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.email}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="w-full mb-6 relative">
          <input
            {...getInputProps('password')}
            type={passwordVisible ? 'text' : 'password'}
            className={`border w-full p-4 focus:outline-none rounded-md bg-gray-800 text-white placeholder-gray-500 transition-colors pr-12 ${
              errors?.password && touched?.password
                ? 'border-red-600 ring-1 ring-red-600'
                : 'border-gray-700 focus:border-red-600'
            }`}
            placeholder="비밀번호를 입력해주세요! (8자~20자)"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
          >
            {passwordVisible ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
          </button>
          {errors?.password && touched.password && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.password}
            </div>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full py-3 rounded-md text-lg font-bold transition-colors shadow-lg mb-4 ${
            isDisabled
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
          }`}
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>

        {/* 구글 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-md text-lg font-bold transition-colors shadow-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
            <span>구글 로그인</span>
          </div>
        </button>

        {/* 하단 링크 */}
        <div className="flex justify-between w-full mt-4 text-sm text-gray-400">
          <span
            className="hover:text-red-500 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </span>
          <span className="hover:text-red-500 cursor-pointer">
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
