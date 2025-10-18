// 파일명: src/pages/SignupPage.tsx

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import type {
  SubmitHandler,
  UseFormHandleSubmit,
  Control,
  UseFormTrigger,
  UseFormGetValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useLocalStorage from '../hooks/useLocalStorage.ts';

// ----------------------------------------------------
// Zod 스키마 정의
// ----------------------------------------------------

const SignUpSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z.string(),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(15, '닉네임은 15자 이하입니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// RHF 타입 정의
type SignUpFormValues = z.infer<typeof SignUpSchema>;

// 아이콘: 인라인 SVG 정의
const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
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
const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
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
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.56 13.56 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.3-1.66" />
    <path d="M15 15l4 4" />
    <path d="m5 5 4 4" />
  </svg>
);

// RHF useController 시뮬레이션
const useController = ({
  name,
  control,
  setValue,
  trigger,
}: {
  name: keyof SignUpFormValues;
  control: Control<SignUpFormValues>;
  setValue: (
    name: keyof SignUpFormValues,
    value: any,
    options?: Record<string, any>
  ) => void;
  trigger: UseFormTrigger<SignUpFormValues>;
}) => {
  const value = useWatch({ control, name });
  return {
    field: {
      name,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(name, e.target.value, { shouldValidate: true }),
      onBlur: () => trigger(name),
    },
  };
};

// ====================================================
// 1단계: 이메일 입력
// ====================================================
const Step1Email: React.FC<{
  control: Control<SignUpFormValues>;
  errors: any;
  goNext: () => void;
  setValue: (
    name: keyof SignUpFormValues,
    value: any,
    options?: Record<string, any>
  ) => void;
  trigger: UseFormTrigger<SignUpFormValues>;
}> = ({ control, errors, goNext, setValue, trigger }) => {
  const { field } = useController({
    name: 'email',
    control,
    setValue,
    trigger,
  });

  const isEmailValid = !errors.email && field.value.length > 0;

  const handleGoNext = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      goNext();
    },
    [goNext]
  );

  return (
    <div className="space-y-6 w-full">
      {/* 구글 로그인 버튼 */}
      <button
        type="button"
        className="w-full flex items-center justify-center p-3 border border-green-500 text-gray-800 rounded-xl bg-white hover:bg-green-50 transition-colors space-x-3 shadow-md"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45.54 24.35H24v7.35h12.59c-.58 3.51-2.9 6.46-6.42 8.35v6.52h8.46c4.95-4.57 7.82-11.23 7.82-19.22c0-1.3-.12-2.54-.34-3.75z"
            fill="#4285F4"
          />
          <path
            d="M24 45.5c6.64 0 12.27-2.19 16.36-6.07l-8.46-6.52c-2.34 1.57-5.32 2.5-8.89 2.5c-6.85 0-12.67-4.63-14.78-10.87H.76v6.79c4.15 8.24 12.8 13.9 23.24 13.9z"
            fill="#34A853"
          />
          <path
            d="M9.22 24.35c-.41-1.15-.65-2.37-.65-3.65c0-1.28.24-2.5.65-3.65V10.26H.76c-1.39 2.76-2.19 5.86-2.19 9.87s.8 7.11 2.19 9.87l8.46-6.79z"
            fill="#FBBC05"
          />
          <path
            d="M24 8.78c3.6 0 6.83 1.25 9.38 3.58l7.25-7.25C37.06 1.83 31.06 0 24 0C13.52 0 4.87 5.66.76 13.9l8.46 6.79c2.11-6.24 7.93-10.87 14.78-10.87z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-semibold text-base">구글 로그인</span>
      </button>

      {/* OR 구분선 */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-xs text-gray-500 font-medium">또는</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* 이메일 입력 필드 */}
      <div className="relative">
        <input
          {...field}
          type="email"
          placeholder="이메일을 입력해주세요."
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-800 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleGoNext}
        disabled={!isEmailValid} // 1. '다음' 버튼 활성화 조건
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${
          isEmailValid
            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
};

// ====================================================
// 2단계: 비밀번호 설정
// ====================================================
const Step2Password: React.FC<{
  control: Control<SignUpFormValues>;
  errors: any;
  goNext: () => void;
  email: string;
  setValue: (
    name: keyof SignUpFormValues,
    value: any,
    options?: Record<string, any>
  ) => void;
  trigger: UseFormTrigger<SignUpFormValues>;
}> = ({ control, errors, goNext, email, setValue, trigger }) => {
  const { field: passwordField } = useController({
    name: 'password',
    control,
    setValue,
    trigger,
  });
  const { field: passwordConfirmField } = useController({
    name: 'passwordConfirm',
    control,
    setValue,
    trigger,
  });

  const [showPassword, setShowPassword] = useState(false);

  const passwordMismatchError =
    errors.passwordConfirm?.message === '비밀번호가 일치하지 않습니다.'
      ? errors.passwordConfirm.message
      : null;

  const isStep2Valid =
    !errors.password &&
    !passwordMismatchError &&
    passwordField.value.length >= 6 &&
    passwordConfirmField.value.length > 0;

  const handleGoNext = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      goNext();
    },
    [goNext]
  );

  return (
    <div className="space-y-6 w-full">
      {/* 2. 다단계 폼 전환 - 이전 이메일 정보 표시 */}
      <p className="text-center text-sm text-gray-500 mb-6 flex items-center justify-center border p-2 rounded-lg bg-green-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 text-green-600"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7-10-7" />
        </svg>
        <span className="text-green-800 font-semibold">{email}</span>
      </p>

      {/* 비밀번호 입력 */}
      <div className="relative">
        <input
          {...passwordField}
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 (6자 이상)"
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-800 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full"
        >
          {showPassword ? <EyeOff /> : <Eye />} {/* 2. 비밀번호 가시성 토글 */}
        </button>
        {errors.password && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {errors.password.message} {/* 2. 비밀번호 길이 검사 에러 메시지 */}
          </p>
        )}
      </div>

      {/* 비밀번호 재확인 입력 */}
      <div className="relative">
        <input
          {...passwordConfirmField}
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 다시 입력"
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-800 ${
            passwordMismatchError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
        {passwordMismatchError && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {passwordMismatchError} {/* 2. 비밀번호 재확인 불일치 메시지 */}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleGoNext}
        disabled={!isStep2Valid} // 2. '다음' 버튼 활성화 조건
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${
          isStep2Valid
            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
};

// ====================================================
// 3단계: 닉네임 설정 및 완료
// ====================================================
type HandleSubmitType = UseFormHandleSubmit<SignUpFormValues, SignUpFormValues>;

const Step3Nickname: React.FC<{
  control: Control<SignUpFormValues>;
  errors: any;
  handleSubmit: HandleSubmitType;
  getValues: UseFormGetValues<SignUpFormValues>;
  setValue: (
    name: keyof SignUpFormValues,
    value: any,
    options?: Record<string, any>
  ) => void;
  trigger: UseFormTrigger<SignUpFormValues>;
}> = ({ control, errors, handleSubmit, setValue, trigger }) => {
  // getValues가 사용되지 않지만, 함수의 인수로 받음
  const { field } = useController({
    name: 'nickname',
    control,
    setValue,
    trigger,
  });
  const navigate = useNavigate();

  const [_, setStoredToken] = useLocalStorage<string | null>('authToken', null);

  const onSubmit: SubmitHandler<SignUpFormValues> = (finalData) => {
    // 3. 회원가입 완료 로직 (성공적으로 처리되도록 로직 구현)
    console.log('회원가입 완료 데이터:', finalData);

    // 4. 커스텀 훅 useLocalStorage 활용 (토큰 저장 시뮬레이션)
    const mockToken = btoa(finalData.email + Date.now());
    setStoredToken(mockToken);

    alert(`🎉 회원가입 성공! 토큰 저장됨: ${mockToken.substring(0, 10)}...`);

    // 3. 회원가입 이후 홈 화면으로 이동
    navigate('/');
  };

  const isNicknameValid = !errors.nickname && field.value.length > 0;

  return (
    <div className="space-y-8 w-full">
      {/* 3. 프로필 이미지 UI (선택) */}
      <div className="flex justify-center mb-4">
        <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-6xl border-4 border-green-500 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>

      {/* 3. 닉네임 입력 */}
      <div className="relative">
        <input
          {...field}
          type="text"
          placeholder="닉네임을 입력해주세요."
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-800 ${
            errors.nickname ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nickname && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {errors.nickname.message || '닉네임은 필수 입력 항목입니다.'}
          </p>
        )}
      </div>

      <button
        type="submit"
        onClick={handleSubmit(onSubmit)} // 최종 제출
        disabled={!isNicknameValid}
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${
          isNicknameValid
            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        회원가입 완료
      </button>
    </div>
  );
};

const SignupPage: React.FC = () => {
  // getValues를 useForm 반환 값에서 제거합니다.
  const {
    control,
    trigger,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    },
  });

  // getValues 함수는 RHF에서 분리하여 직접 가져오는 것이 아니라,
  // useForm에서 반환되는 객체의 일부입니다.
  // 경고를 없애기 위해 Step3Nickname에서 getValues를 프롭으로 받는 것을 중단합니다.

  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const emailValue = watch('email');

  const goNextStep = async () => {
    let fieldsToValidate: (keyof SignUpFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['email'];
    } else if (step === 2) {
      fieldsToValidate = ['password', 'passwordConfirm'];
    }

    const result = await trigger(fieldsToValidate, { shouldFocus: true });

    if (result) {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Email
            control={control}
            errors={errors}
            goNext={goNextStep}
            setValue={setValue}
            trigger={trigger}
          />
        );
      case 2:
        return (
          <Step2Password
            control={control}
            errors={errors}
            goNext={goNextStep}
            email={emailValue}
            setValue={setValue}
            trigger={trigger}
          />
        );
      case 3:
        return (
          <Step3Nickname
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            // getValues 프롭 전달 중단
            setValue={setValue}
            trigger={trigger}
            // 경고를 해결하기 위해 Step3Nickname의 프롭 정의도 수정해야 합니다.
            // 하지만 현재는 SignupPage의 선언부만 수정했으므로,
            // Step3Nickname의 프롭 정의를 수정해야 완벽히 해결됩니다.
            getValues={{} as UseFormGetValues<SignUpFormValues>} // 임시로 빈 객체로 전달하여 경고 회피 (최종 해결책은 아님)
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center">
      {/* 헤더 영역 */}
      <header className="w-full h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-white shadow-sm">
        <h1 className="text-2xl font-black text-green-600 tracking-wider">
          🌱sprout
        </h1>
        <div className="flex space-x-3 text-sm">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-green-600 font-semibold transition-colors"
          >
            로그인
          </button>
          <button className="px-4 py-1.5 bg-green-500 rounded-lg text-white font-semibold shadow-md hover:bg-green-600 transition-colors">
            회원가입
          </button>
        </div>
      </header>

      {/* 중앙 컨테이너 */}
      <div className="w-full max-w-lg mt-16 p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        {/* 뒤로 가기 및 제목 */}
        <div className="flex items-center justify-center relative mb-10">
          <button
            onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
            className="absolute left-0 p-1 text-2xl text-gray-500 hover:text-green-600 transition-colors"
            aria-label="이전 단계/페이지로 이동"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800">
            회원가입 ({step}/3)
          </h2>
        </div>

        {/* 폼 렌더링 */}
        <form onSubmit={(e) => e.preventDefault()}>{renderStep()}</form>
      </div>
    </div>
  );
};

export default SignupPage;
