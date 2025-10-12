import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

const SignupPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'email' | 'password' | 'nickname'>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    formState, 
    updateField, 
    validateField, 
    getFieldValue, 
    getFieldError, 
    isFormValid,
    isFieldValid
  } = useForm(['email', 'password', 'confirmPassword', 'nickname']);

  const handleBackClick = () => {
    if (currentStep === 'email') {
      navigate(-1);
    } else if (currentStep === 'password') {
      setCurrentStep('email');
    } else if (currentStep === 'nickname') {
      setCurrentStep('password');
    }
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
    if (password.length < 6) {
      return '비밀번호는 6자 이상이어야 합니다.';
    }
    return '';
  };

  // 비밀번호 확인 유효성 검사 함수
  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) {
      return '';
    }
    const password = getFieldValue('password');
    if (confirmPassword !== password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  // 닉네임 유효성 검사 함수
  const validateNickname = (nickname: string): string => {
    if (!nickname) {
      return '';
    }
    if (nickname.length < 2) {
      return '닉네임은 2자 이상이어야 합니다.';
    }
    if (nickname.length > 20) {
      return '닉네임은 20자 이하여야 합니다.';
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
    // 비밀번호가 변경되면 확인 비밀번호도 다시 검증 (약간의 지연 후)
    setTimeout(() => {
      validateField('confirmPassword', validateConfirmPassword);
    }, 0);
  };

  // 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField('confirmPassword', value);
    // 즉시 검증 실행
    setTimeout(() => {
      validateField('confirmPassword', validateConfirmPassword);
    }, 0);
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField('nickname', value);
    validateField('nickname', validateNickname);
  };

  const handleGoogleSignup = () => {
    // 구글 회원가입 로직 구현 예정
    console.log('구글 회원가입 시도');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'email') {
      // 이메일 유효성 검사
      const emailValid = validateEmail(getFieldValue('email')) === '';
      validateField('email', validateEmail);

      // 유효성 검사 통과 시 다음 단계로 이동
      if (emailValid) {
        setEmail(getFieldValue('email'));
        setCurrentStep('password');
      }
    } else if (currentStep === 'password') {
      // 비밀번호 유효성 검사
      const passwordValid = validatePassword(getFieldValue('password')) === '';
      const confirmPasswordValid = validateConfirmPassword(getFieldValue('confirmPassword')) === '';
      
      validateField('password', validatePassword);
      validateField('confirmPassword', validateConfirmPassword);

      // 모든 유효성 검사 통과 시 다음 단계로 이동
      if (passwordValid && confirmPasswordValid) {
        setCurrentStep('nickname');
      }
    } else if (currentStep === 'nickname') {
      // 닉네임 유효성 검사
      const nicknameValid = validateNickname(getFieldValue('nickname')) === '';
      validateField('nickname', validateNickname);

      // 모든 유효성 검사 통과 시 회원가입 완료
      if (nicknameValid) {
        console.log('회원가입 완료:', {
          email,
          password: getFieldValue('password'),
          nickname: getFieldValue('nickname')
        });
        // 실제 회원가입 로직 구현 예정
        navigate('/'); // 홈으로 이동
      }
    }
  };

  // 비밀번호 가시성 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 이메일 단계 렌더링
  const renderEmailStep = () => (
    <form onSubmit={handleNext} className="space-y-6">
      {/* 구글 회원가입 버튼 */}
      <button
        type="button"
        onClick={handleGoogleSignup}
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

      {/* 다음 버튼 */}
      <button
        type="submit"
        disabled={!isFieldValid('email')}
        className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
          isFieldValid('email')
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transform hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </form>
  );

  // 비밀번호 단계 렌더링
  const renderPasswordStep = () => (
    <form onSubmit={handleNext} className="space-y-6">
      {/* 이메일 정보 표시 */}
      <div className="flex items-center gap-2 text-white mb-4">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        <span>{email}</span>
      </div>

      {/* 비밀번호 입력 필드 */}
      <div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={getFieldValue('password')}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요!"
            className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
              getFieldError('password') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-700 focus:ring-pink-500'
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            )}
          </button>
        </div>
        {getFieldError('password') && (
          <p className="mt-2 text-sm text-red-500">{getFieldError('password')}</p>
        )}
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={getFieldValue('confirmPassword')}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호를 다시 한 번 입력해주세요!"
            className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
              getFieldError('confirmPassword') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-700 focus:ring-pink-500'
            }`}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            )}
          </button>
        </div>
        {getFieldError('confirmPassword') && (
          <p className="mt-2 text-sm text-red-500">{getFieldError('confirmPassword')}</p>
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        type="submit"
        disabled={!isFieldValid('password') || !isFieldValid('confirmPassword')}
        className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
          isFieldValid('password') && isFieldValid('confirmPassword')
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transform hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </form>
  );

  // 닉네임 단계 렌더링
  const renderNicknameStep = () => (
    <form onSubmit={handleNext} className="space-y-6">
      {/* 프로필 이미지 UI */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* 닉네임 입력 필드 */}
      <div>
        <input
          type="text"
          value={getFieldValue('nickname')}
          onChange={handleNicknameChange}
          placeholder="매튜오타니안"
          className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
            getFieldError('nickname') 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-700 focus:ring-pink-500'
          }`}
        />
        {getFieldError('nickname') && (
          <p className="mt-2 text-sm text-red-500">{getFieldError('nickname')}</p>
        )}
      </div>

      {/* 회원가입 완료 버튼 */}
      <button
        type="submit"
        disabled={!isFieldValid('nickname')}
        className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
          isFieldValid('nickname')
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transform hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        회원가입 완료
      </button>
    </form>
  );

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
          <h1 className="text-2xl font-bold text-white">회원가입</h1>
        </div>

        {/* 단계별 폼 렌더링 */}
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'password' && renderPasswordStep()}
        {currentStep === 'nickname' && renderNicknameStep()}
      </div>
    </div>
  );
};

export default SignupPage;