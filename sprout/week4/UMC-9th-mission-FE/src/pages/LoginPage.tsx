import useForm from '../hooks/useForm';
// UserSigninInformation과 validateSignin는 실제 프로젝트 경로에 맞게 사용해주세요.
import { type UserSigninInformation, validateSignin } from '../utils/validate';

// LoginPage 컴포넌트 선언
const LoginPage = () => {
  // 1. useForm Hook의 반환 값을 정확히 구조 분해합니다.
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      // initialValue를 객체로 전달합니다.
      initialValue: {
        email: '',
        password: '',
      },
      // validate 함수를 전달합니다.
      validate: validateSignin,
    });

  // 폼 제출 로직 (영상에서는 console.log로 대체)
  const handleSubmit = () => {
    // 유효성 검사를 통과했을 때만 실행됩니다.
    console.log('로그인 시도:', values);
  };

  // 2. 버튼 비활성화 로직 (isDisabled)을 올바른 JavaScript 문법으로 선언합니다.
  // 오류가 하나라도 있거나, 입력값 중 하나라도 비어있으면 true (비활성화)
  const isDisabled =
    // 1) errors 객체의 값 중 길이가 0보다 큰 (오류 메시지가 있는) 것이 하나라도 있는 경우
    Object.values(errors).some((error: string) => error.length > 0) ||
    // 2) values 객체의 값 중 빈 문자열인 것이 하나라도 있는 경우 (필수 입력 검사)
    Object.values(values).some((value: string) => value === '');

  return (
    // Tailwind CSS 클래스: flex-col 정렬, 중앙 정렬, 전체 높이, gap 4
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        {/* 이메일 입력 필드 */}
        <input
          // 3. getInputProps에 name만 문자열로 전달합니다.
          {...getInputProps('email')}
          // 에러와 touched 상태에 따라 동적으로 스타일을 적용합니다.
          className={`
            border w-[300px] p-[10px] focus:outline-none focus:border-[#807bff] rounded-sm
            ${
              errors?.email && touched?.email
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }
          `}
          type={'email'}
          placeholder={'이메일'}
        />
        {/* 이메일 에러 메시지 표시 */}
        {errors?.email && touched.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        {/* 비밀번호 입력 필드 */}
        <input
          // 3. getInputProps에 name만 문자열로 전달합니다.
          {...getInputProps('password')}
          // 에러와 touched 상태에 따라 동적으로 스타일을 적용합니다.
          className={`
            border w-[300px] p-[10px] focus:outline-none focus:border-[#807bff] rounded-sm
            ${
              errors?.password && touched?.password
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }
          `}
          type={'password'}
          placeholder={'비밀번호'}
        />
        {/* 비밀번호 에러 메시지 표시 */}
        {errors?.password && touched.password && (
          // 4. 비밀번호 에러는 errors.password를 출력하도록 수정합니다.
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        {/* 로그인 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          // isDisabled 변수를 연결합니다.
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
