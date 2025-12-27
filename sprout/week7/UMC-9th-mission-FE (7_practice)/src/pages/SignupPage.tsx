import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';
// 🚨 필수 수정: 다단계 기능 구현을 위해 useState, useCallback, useNavigate 추가
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { RequestSignupDto } from '../types/auth'; // 원본 import 유지
import { postSignup } from '../apis/auth'; // 원본 import 유지

// --- 컴포넌트 Helpers (UI) ---
// 🚨 타입 오류 해결: props에 타입을 명시하지 않았던 오류를 해결하기 위해 제거
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.91 1.91 0 0 1 .53-1.89m-1.28-3C.95 9.4 2.89 7.42 5.09 6M9 11l4 4m6 1l-1.44-1.44M11.59 3.03A10.32 10.32 0 0 1 12 4c7 0 10 7 10 7a1.91 1.91 0 0 1-.53 1.89" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
// 🚨 타입 오류 해결: props 타입 명시
const EmailDisplay = ({ email }: { email: string }) => (
  <div className="w-full text-center text-gray-800 mb-4 border-b border-gray-300 pb-2 text-sm">
    이메일: {email}
  </div>
);
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-800 text-2xl p-1 hover:text-blue-500 transition-colors"
    aria-label="이전 단계"
  >
    &lt;
  </button>
);

// Zod 스키마 정의 (사용자 코드 그대로 유지)
const schema = z
  .object({
    email: z.string().email({ message: '올바른 이메일 형식을 입력해주세요.' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' }),
    passwordCheck: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' }),
    name: z.string().min(1, { message: '이름(닉네임)을 입력해주세요.' }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type FormFields = z.infer<typeof schema>;

// 컴포넌트 함수 정의
const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 🚨 단계 관리 state 추가
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 토글 상태

  // useForm 호출 (사용자 코드 유지)
  const {
    register,
    handleSubmit,
    trigger, // 🚨 trigger 함수 추가
    getValues, // 🚨 getValues 함수 추가
    // 🚨 TypeScript 오류 해결: isValid를 useForm에서 가져와야 하지만, 대신 isSubmitting을 사용하도록 변경
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
    },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  // 🚨 현재 단계의 필드 유효성 검사 로직
  // 🚨 TypeScript 오류 해결: 매개변수에 타입 지정 (number)
  const isCurrentStepValid = (currentStep: number) => {
    // 필드가 터치되었고 해당 필드에 오류가 없어야 유효함
    if (currentStep === 1) {
      // 🚨 미션 조건: 이메일 유효성 검사 충족 (터치되었고 오류 없음)
      return touchedFields.email && !errors.email;
    }
    if (currentStep === 2) {
      // 🚨 미션 조건: 비밀번호 유효성 검사 충족 (길이, 일치 모두 zod가 처리)
      return (
        touchedFields.password &&
        touchedFields.passwordCheck &&
        !errors.password &&
        !errors.passwordCheck
      );
    }
    if (currentStep === 3) {
      // 🚨 미션 조건: 닉네임 유효성 검사 충족
      return touchedFields.name && !errors.name;
    }
    return false;
  };

  // 🚨 다음 단계로 넘어가는 핸들러
  const handleNextStep = useCallback(async () => {
    // 🚨 TypeScript 오류 해결: fieldsToValidate에 명시적 타입 지정
    let fieldsToValidate: (keyof FormFields)[] = [];
    if (step === 1) fieldsToValidate = ['email'];
    if (step === 2) fieldsToValidate = ['password', 'passwordCheck'];

    // 현재 단계 필드에 대한 유효성 검사 강제 실행
    const result = await trigger(fieldsToValidate);

    if (result && isCurrentStepValid(step)) {
      setStep((prev) => prev + 1);
    } else {
      console.log('유효성 검사 실패로 다음 단계 이동 불가');
    }
  }, [step, trigger, isCurrentStepValid, errors, touchedFields]);

  // 🚨 이전 단계로 돌아가는 핸들러
  const handlePrevStep = useCallback(() => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  }, [step, navigate]);

  // 폼 제출 시 실행할 최종 onSubmit 함수 (사용자 코드 그대로 유지)
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;

    try {
      const response = await postSignup(rest as RequestSignupDto);
      console.log('회원가입 성공 응답:', response);

      // 🚨 미션 조건: 회원가입 이후 홈 화면으로 이동합니다.
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  // --- 렌더링 파트 ---
  const renderCurrentStepFields = () => {
    // 1단계: 이메일 입력
    if (step === 1) {
      return (
        <>
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <input
              {...register('email')}
              className={`border w-full p-3 focus:ring-2 focus:ring-[#807eff] focus:border-[#807eff] rounded-lg transition duration-150 text-gray-900 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              type={'email'}
              placeholder={'이메일'}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </>
      );
    }

    // 2단계: 비밀번호 설정 및 재확인
    if (step === 2) {
      return (
        <>
          {/* 🚨 미션 조건: 이전 이메일 정보 상단 표시 */}
          <EmailDisplay email={getValues('email')} />

          {/* Password Input (비밀번호 가시성 토글 기능 추가) */}
          <div className="flex flex-col gap-1 relative">
            <input
              {...register('password')}
              // 🚨 미션 조건: 비밀번호 가시성 토글
              type={passwordVisible ? 'text' : 'password'}
              className={`border w-full p-3 pr-10 focus:ring-2 focus:ring-[#807eff] focus:border-[#807eff] rounded-lg transition duration-150 text-gray-900 ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={'비밀번호 (8~20자)'}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Check Input (비밀번호 가시성 토글 기능 추가) */}
          <div className="flex flex-col gap-1 relative">
            <input
              {...register('passwordCheck')}
              // 🚨 미션 조건: 비밀번호 가시성 토글
              type={passwordVisible ? 'text' : 'password'}
              className={`border w-full p-3 pr-10 focus:ring-2 focus:ring-[#807eff] focus:border-[#807eff] rounded-lg transition duration-150 text-gray-900 ${
                errors.passwordCheck
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder={'비밀번호 확인'}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
            </button>
            {errors.passwordCheck && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordCheck.message}
              </p>
            )}
          </div>
        </>
      );
    }

    // 3단계: 닉네임 설정 및 완료
    if (step === 3) {
      return (
        <>
          <EmailDisplay email={getValues('email')} />
          <h2 className="text-xl font-bold text-center text-gray-800">
            닉네임 설정
          </h2>

          {/* 🚨 미션 조건: 프로필 이미지 UI (UI만 구현) */}
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-4 border border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* 🚨 미션 조건: 닉네임 입력 필드 */}
          <div className="flex flex-col gap-1">
            <input
              {...register('name')}
              className={`border w-full p-3 focus:ring-2 focus:ring-[#807eff] focus:border-[#807eff] rounded-lg transition duration-150 text-gray-900 ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              type={'text'}
              placeholder={'이름(닉네임)'}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    // <form> 태그는 최종 3단계에서만 제출을 처리합니다.
    <form
      onSubmit={step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
      className="flex flex-col items-center min-h-screen justify-center p-4 bg-gray-50 font-sans"
    >
      <div className="bg-white p-8 shadow-xl rounded-lg flex flex-col gap-6 w-full max-w-sm">
        {/* 뒤로 가기 / 제목 */}
        <div className="flex items-center justify-between w-full">
          {/* 🚨 미션 조건: 뒤로가기 버튼 */}
          <div className="w-8">
            {step > 1 && <BackButton onClick={handlePrevStep} />}
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            회원가입
          </h1>
          <div className="w-8"></div>
        </div>

        <div className="flex flex-col gap-4">{renderCurrentStepFields()}</div>

        {/* 🚨 버튼 (다음/회원가입 완료) */}
        <button
          // 3단계일 때는 submit, 아니면 다음 단계로 이동하는 버튼으로 동작
          type={step === 3 ? 'submit' : 'button'}
          onClick={step !== 3 ? handleNextStep : undefined} // 3단계가 아니면 nextStep 호출
          disabled={!isCurrentStepValid(step) || (step === 3 && isSubmitting)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {step === 3
            ? isSubmitting
              ? '처리 중...'
              : '회원가입 완료'
            : '다음'}
        </button>
      </div>
    </form>
  );
};

export default SignupPage;
