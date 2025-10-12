import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const { 
    formState, 
    updateField, 
    validateField, 
    getFieldValue, 
    getFieldError, 
    isFormValid 
  } = useForm(['email', 'password']);

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return '';
    }
    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    return '';
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string => {
    if (!password) {
      return '';
    }
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    return '';
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField('email', value);
    validateField('email', validateEmail);
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField('password', value);
    validateField('password', validatePassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 제출 시 유효성 검사
    const emailValid = validateEmail(getFieldValue('email')) === '';
    const passwordValid = validatePassword(getFieldValue('password')) === '';
    
    // 각 필드 유효성 검사 실행
    validateField('email', validateEmail);
    validateField('password', validatePassword);

    // 모든 유효성 검사 통과 시 로그인 시도
    if (emailValid && passwordValid) {
      console.log('로그인 시도:', { 
        email: getFieldValue('email'), 
        password: getFieldValue('password') 
      });
      // 실제 로그인 로직 구현 예정
      navigate('/'); // 홈으로 이동
    }
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 로직 구현 예정
    console.log('구글 로그인 시도');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 뒤로 가기 버튼과 제목 */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBackClick}
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
            aria-label="이전 페이지로 이동"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">로그인</h1>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            구글 로그인
          </button>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">OR</span>
            </div>
          </div>

          {/* 이메일 입력 필드 */}
          <div>
            <input
              type="email"
              value={getFieldValue('email')}
              onChange={handleEmailChange}
              placeholder="이메일을 입력해주세요!"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                getFieldError('email') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-pink-500'
              }`}
            />
            {getFieldError('email') && (
              <p className="mt-2 text-sm text-red-500">{getFieldError('email')}</p>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <input
              type="password"
              value={getFieldValue('password')}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요!"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                getFieldError('password') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-pink-500'
              }`}
            />
            {getFieldError('password') && (
              <p className="mt-2 text-sm text-red-500">{getFieldError('password')}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
              isFormValid()
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
