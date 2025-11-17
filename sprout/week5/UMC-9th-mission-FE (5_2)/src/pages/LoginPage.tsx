import { useState, type ReactElement, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useForm from '../hooks/useForm'; // 경로가 정확해야 함
import { type UserSigninInformation, validateSignin } from '../utils/validate'; // 경로가 정확해야 함
import type { ResponseSigninDto } from '../types/auth';
import { postSignin } from '../apis/auth'; // 경로가 정확해야 함
import { useLocalStorage } from '../hooks/useLocalStorage'; // 경로가 정확해야 함
import { LOCAL_STORAGE_KEY } from '../constants/key'; // 경로가 정확해야 함
import { useAuth } from '../context/AuthContext'; // 경로가 정확해야 함

// EyeIcon과 EyeOffIcon은 변경 없음
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
    <circle cx="12" cy="12" r="3" /> {' '}
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
    {' '}
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.91 1.91 0 0 1 .53-1.89m-1.28-3C.95 9.4 2.89 7.42 5.09 6M9 11l4 4m6 1l-1.44-1.44M11.59 3.03A10.32 10.32 0 0 1 12 4c7 0 10 7 10 7a1.91 1.91 0 0 1-.53 1.89" />
    <line x1="2" x2="22" y1="2" y2="22" /> {' '}
  </svg>
);

// --- 컴포넌트 시작 ---

const LoginPage = (): ReactElement => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false); // Access Token과 Refresh Token의 setItem 함수를 모두 가져옵니다.

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
    }); // 이미 로그인되어 있다면, 원래 가려던 페이지 또는 '/my'로 이동합니다.

  useEffect(() => {
    if (accessToken) {
      // ProtectedLayout에서 state에 저장한 원래 경로(from)를 확인합니다.
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/my'; // 이 코드는 이미 로그인이 완료된 사용자를 보호 경로로 바로 보내줍니다.
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, location.state]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const isDisabled =
    Object.values(errors).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === ''); // handleSubmit 함수: 유효성 검사 및 API 성공 시에만 리다이렉트합니다.

  const handleSubmit = async () => {
    // 1. 유효성 검사 통과 여부 확인 (빈 칸이거나 에러가 있으면 여기서 중단)
    if (isDisabled) {
      console.log('유효성 검사 실패 또는 빈 칸 존재. API 호출을 건너뜜');
      return;
    }

    let response: ResponseSigninDto;

    try {
      // 2. 실제 API 연동 (유효성 검사 통과 후에만 실행)
      response = await postSignin(values); // 3. API 호출 성공: // a) 토큰 저장 (Local Storage)

      setAccessToken(response.data.accessToken); // Refresh Token 저장 로직 추가 // (서버 응답 구조에 맞춰 response.data.refreshToken에서 값을 가져옵니다.)
      setRefreshToken(response.data.refreshToken); // b) Context 상태 업데이트 (Context가 로컬 스토리지의 토큰을 읽어가도록 트리거)

      await login(values); // c) 페이지 이동 (마이페이지로 이동)

      console.log(response); // ProtectedLayout이 보낸 원래 경로(from)를 사용하거나, /my로 직접 이동합니다.

      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/my';
      navigate(from, { replace: true }); // 로그인 성공 후 마이페이지로 연결되는 핵심 코드입니다.
    } catch (error: any) {
      // 4. 에러 처리
      console.error(
        error.message || '로그인 중 알 수 없는 오류가 발생했습니다.'
      ); // 로그인 실패 시에는 페이지 이동을 하지 않습니다.
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white min-h-screen **pt-16**">
      <div className="flex flex-col items-center p-8 bg-gray-900 rounded-xl shadow-2xl w-full max-w-md **my-auto**">
        {/* 뒤로 가기 버튼 및 제목 */}{' '}
        <div className="flex items-center justify-between w-full mb-8">
          {' '}
          <button
            onClick={handleGoBack}
            className="text-white text-2xl p-1 hover:text-red-500 transition-colors"
            aria-label="뒤로 가기"
          >
            &lt;{' '}
          </button>
          <h2 className="text-3xl font-bold text-white">로그인</h2>
          <div className="w-8"></div>{' '}
        </div>
        {/* 이메일 입력 필드 */}{' '}
        <div className="w-full mb-4">
          {' '}
          <input
            {...getInputProps('email')}
            className={`
border w-full p-4 focus:outline-none rounded-md bg-gray-800 text-white placeholder-gray-500 transition-colors
${
  errors?.email && touched?.email
    ? 'border-red-600 ring-1 ring-red-600'
    : 'border-gray-700 focus:border-red-600'
}
`}
            type={'email'}
            placeholder={'이메일을 입력해주세요!'}
          />
          {/* 이메일 에러 메시지 표시 */}{' '}
          {errors?.email && touched.email && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.email}{' '}
            </div>
          )}{' '}
        </div>
        {/* 비밀번호 입력 필드 */}{' '}
        <div className="w-full mb-6 relative">
          {' '}
          <input
            {...getInputProps('password')}
            type={passwordVisible ? 'text' : 'password'}
            className={`
border w-full p-4 focus:outline-none rounded-md bg-gray-800 text-white placeholder-gray-500 transition-colors pr-12
  ${
    errors?.password && touched?.password
      ? 'border-red-600 ring-1 ring-red-600'
      : 'border-gray-700 focus:border-red-600'
  }
`}
            placeholder={'비밀번호를 입력해주세요! (8자~20자)'}
          />
          {/* 비밀번호 표시/숨김 토글 버튼 */}{' '}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
            aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {' '}
            {passwordVisible ? (
              <EyeIcon size={20} />
            ) : (
              <EyeOffIcon size={20} />
            )}{' '}
          </button>
          {/* 비밀번호 에러 메시지 표시 */}{' '}
          {errors?.password && touched.password && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.password}{' '}
            </div>
          )}{' '}
        </div>
        {/* 로그인 버튼 */}{' '}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`
          w-full py-3 rounded-md text-lg font-bold transition-colors shadow-lg
${
  isDisabled
    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
    : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
}
`}
        >
          로그인{' '}
        </button>
        {/* 회원가입 및 비밀번호 찾기 링크 */}{' '}
        <div className="flex justify-between w-full mt-4 text-sm text-gray-400">
          {' '}
          <span className="hover:text-red-500 cursor-pointer">
            회원가입
          </span>{' '}
          <span className="hover:text-red-500 cursor-pointer">
            비밀번호 찾기{' '}
          </span>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
};

export default LoginPage;
