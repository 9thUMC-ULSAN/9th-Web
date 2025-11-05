// useForm과 LoginPage에서 사용할 타입을 interface로 정의합니다.
export interface UserSigninInformation {
  email: string;
  password: string;
}

// useForm에서 요구하는 errors 객체의 타입을 정의합니다.
type Errors<T> = Record<keyof T, string>;

// 공통 유효성 검사 로직을 처리하는 함수입니다.
function validateUser(
  values: UserSigninInformation): Errors<UserSigninInformation> {
  // 1. errors 객체를 명확한 타입으로 초기화합니다.
  const errors: Errors<UserSigninInformation> = {
    email: '',
    password: '',
  };

  // 이메일 유효성 검사를 위한 정규 표현식
  const emailRegex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  // 이메일 형식 검사
  if (!emailRegex.test(values.email)) {
    errors.email = '유효하지 않은 이메일 형식입니다.';
  }

  // 비밀번호 길이 검사: 최소 6자 이상 20자 미만
  if (!(values.password.length >= 6 && values.password.length < 20)) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  return errors;
} 

// 로그인 유효성 검사 함수
function validateSignin(
  values: UserSigninInformation): Errors<UserSigninInformation> {
  return validateUser(values);
}

export { validateSignin };