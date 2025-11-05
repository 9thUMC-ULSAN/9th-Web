import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { type UserSigninInformation, validateSignin } from '../utils/validate';
import type { ReactElement } from 'react';

// --- 인라인 SVG 아이콘 정의 ---

const GoogleIcon = (): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.637,4.032-5.918,7.258-11.303,7.258c-6.702,0-12.152-5.45-12.152-12.152s5.45-12.152,12.152-12.152c3.085,0,5.842,1.17,8.006,3.092l5.448-5.448C33.911,4.1,28.784,2,24,2C11.85,2,2,11.85,2,24s9.85,22,22,22c11.082,0,21-8.08,21-22C45.001,21.841,43.729,20.21,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691L16.223,21.05C14.288,22.357,13.011,24,13.011,24C13.011,24,13.011,24.033,13.011,24.033c0,4.717,2.83,8.749,6.864,10.605c0.559,0.258,1.16,0.395,1.782,0.395c0.473,0,0.935-0.087,1.378-0.24l9.539,5.744c-2.27,1.527-4.908,2.404-7.795,2.404C11.85,46,2,36.15,2,24C2,21.821,2.309,19.743,2.859,17.749L6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,45c2.909,0,5.666-0.877,8.084-2.399l-9.539-5.744c0.443-0.153,0.905-0.24,1.378-0.24c5.053,0,9.255-3.881,9.664-8.895h11.411C43.729,32.798,34.004,45,24,45z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.781,2.028-2.029,3.778-3.693,5.084c2.816-1.523,4.821-4.226,4.821-7.258c0-1.74-0.428-3.391-1.229-4.721L43.611,20.083z"/>
    </svg>
);

const EyeIcon = (props: { size: number, className?: string, onClick?: () => void }): ReactElement => (
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

const EyeOffIcon = (props: { size: number, className?: string, onClick?: () => void }): ReactElement => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.91 1.91 0 0 1 .53-1.89m-1.28-3C.95 9.4 2.89 7.42 5.09 6M9 11l4 4m6 1l-1.44-1.44M11.59 3.03A10.32 10.32 0 0 1 12 4c7 0 10 7 10 7a1.91 1.91 0 0 1-.53 1.89"/>
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

// --- 컴포넌트 시작 ---

const LoginPage = (): ReactElement => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 토글 상태

  // useForm Hook 초기화
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: '',
        password: '',
      },
      validate: validateSignin,
    });

  // 이전 페이지로 이동하는 함수
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // 비밀번호 표시 상태 토글 함수
  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  // 폼 제출 로직 (성공 시 영화 목록으로 리다이렉트)
  const handleSubmit = () => {
    console.log('로그인 시도:', values);
    
    // 임시로 로그인 성공 간주 후 리다이렉트
    // 실제 API 연동 시에는 여기에 await axios.post(...) 로직이 들어갑니다.
    console.log('로그인 성공! 영화 페이지로 이동합니다.');
    navigate('/movies/popular'); // 영화 목록 페이지로 이동
  };

  // 버튼 비활성화 로직: 유효성 검사 오류가 없어야 하고, 모든 입력 필드가 채워져 있어야 합니다.
  const isDisabled =
    Object.values(errors).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === '');

  return (
    // 배경색을 어둡게 설정
    <div className="flex flex-col items-center justify-center h-full bg-black text-white min-h-screen">
      
      {/* 상단 네비게이션/헤더: 원래 사용자 코드 유지 (HomeLayout과 중복됨) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black shadow-lg border-b border-gray-800">
        <h1 className="text-2xl font-extrabold text-red-600">🍿 Movies 🍿</h1>
        <div className="flex space-x-2">
          <button className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 transition-colors">
            로그인
          </button>
          <button className="bg-gray-700 text-white py-1 px-3 rounded text-sm hover:bg-gray-600 transition-colors">
            회원가입
          </button>
        </div>
      </div>

      {/* 로그인 폼 컨테이너 */}
      <div className="flex flex-col items-center p-8 bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mt-20">
        
        {/* 뒤로 가기 버튼 및 제목 */}
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

        {/* 구글 로그인 버튼 */}
        <button className="flex items-center justify-center w-full bg-gray-800 text-white py-3 rounded-md mb-4 text-lg hover:bg-gray-700 transition-colors">
          <GoogleIcon />
          <span className="ml-3">구글 로그인</span>
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center w-full mb-6">
          <hr className="flex-grow border-gray-600" />
          <span className="px-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="w-full mb-4">
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
          {/* 이메일 에러 메시지 표시 */}
          {errors?.email && touched.email && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.email}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 필드 (토글 기능 적용 및 안정적인 아이콘 배치) */}
        <div className="w-full mb-6 relative"> 
          <input
            {...getInputProps('password')}
            // passwordVisible 상태에 따라 타입을 동적으로 설정
            type={passwordVisible ? 'text' : 'password'}
            className={`
              border w-full p-4 focus:outline-none rounded-md bg-gray-800 text-white placeholder-gray-500 transition-colors pr-12 
              ${
                errors?.password && touched?.password
                  ? 'border-red-600 ring-1 ring-red-600'
                  : 'border-gray-700 focus:border-red-600'
              }
            `}
            placeholder={'비밀번호를 입력해주세요! (최소 6자)'}
          />

          {/* 비밀번호 표시/숨김 토글 버튼 (눈 마크 - 하나만 고정 표시) */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
            aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {/* 현재 상태에 맞는 아이콘 하나만 표시 */}
            {passwordVisible 
              ? <EyeIcon size={20} /> 
              : <EyeOffIcon size={20} />
            }
          </button>


          {/* 비밀번호 에러 메시지 표시 */}
          {errors?.password && touched.password && (
            <div className="text-red-500 text-sm mt-1 w-full text-left font-medium">
              {errors.password}
            </div>
          )}
        </div>

        {/* 로그인 버튼: 빨간색 적용 */}
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
          로그인
        </button>

        {/* 회원가입 및 비밀번호 찾기 링크 */}
        <div className="flex justify-between w-full mt-4 text-sm text-gray-400">
          <span className="hover:text-red-500 cursor-pointer">회원가입</span>
          <span className="hover:text-red-500 cursor-pointer">
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;