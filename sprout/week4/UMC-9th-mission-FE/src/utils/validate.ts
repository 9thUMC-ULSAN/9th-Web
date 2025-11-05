// useForm과 LoginPage에서 사용할 타입을 interface로 정의합니다.
// UserSignInformation의 오타를 수정하고 이름을 통일했습니다.
export interface UserSigninInformation {
  email: string;
  password: string;
}

// useForm에서 요구하는 errors 객체의 타입을 정의합니다.
type Errors<T> = Record<keyof T, string>;

// 공통 유효성 검사 로직을 처리하는 함수입니다.
function validateUser(
  values: UserSigninInformation
): Errors<UserSigninInformation> {
  // 1. errors 객체를 명확한 타입으로 초기화합니다.
  const errors: Errors<UserSigninInformation> = {
    email: '',
    password: '',
  };

  // 이메일 유효성 검사를 위한 정규 표현식 (간결화를 위해 변수로 분리)
  const emailRegex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  // 이메일 형식 검사
  if (!emailRegex.test(values.email)) {
    // 2. if 조건문 뒤에 중괄호를 추가하여 스코프 오류를 수정했습니다.
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }

  // 비밀번호 길이 검사: 8자 이상 20자 미만
  // 2. if 조건문 뒤에 중괄호를 추가하여 스코프 오류를 수정했습니다.
  if (!(values.password.length >= 8 && values.password.length < 20)) {
    errors.password = '비밀번호는 8자 이상 20자 미만으로 입력해주세요.';
  }

  return errors;
} // 함수가 여기서 닫히도록 수정했습니다.

// 로그인 유효성 검사 함수 (현재는 validateUser를 바로 호출)
function validateSignin(
  values: UserSigninInformation
): Errors<UserSigninInformation> {
  // 폼이 커지면 (예: 회원가입 시) 여기에 추가적인 로직을 넣을 수 있습니다.
  return validateUser(values);
}

export { validateSignin };
