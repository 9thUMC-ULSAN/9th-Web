import { useForm } from '../hooks/useForm';
import { validateSignIn } from '../utils/validator';
import { UserSignInInformation } from '../utils/validator';

const LoginPage = () => {
  const { values, errors, touched, getInPutProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: '',
        password: '',
      },
      validator: validateSignIn,
    });

  // 버튼 비활성화 로직: 오류가 하나라도 있거나 입력값이 비어 있으면 비활성화 [00:47:08]
  const isDisable =
    Object.keys(errors).length > 0 ||
    Object.values(values).some((value) => value === '');

  const handleSubit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisable) return;

    // API 요청 로직 (영상에서는 콘솔 로그로 대체) [00:48:28]
    console.log('로그인 요청 데이터:', values);
    // await post('/v1/auth/signin', values);
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <div className="flex flex-col w-[400px] gap-3 p-10 bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubit} className="flex flex-col gap-3">
          {/* 이메일 입력 필드 */}
          <input
            type="email"
            placeholder="이메일"
            className={`border rounded-lg p-3 focus:outline-none focus:border-[#807BFF] ${
              errors.email && touched.email
                ? 'border-red-500 bg-red-100'
                : 'border-gray-300'
            }`}
            {...getInPutProps('email')}
          />
          {errors.email && touched.email && (
            <div className="text-red-500 text-sm">{errors.email}</div> // [00:44:30]
          )}

          {/* 비밀번호 입력 필드 */}
          <input
            type="password"
            placeholder="비밀번호"
            className={`border rounded-lg p-3 focus:outline-none focus:border-[#807BFF] ${
              errors.password && touched.password
                ? 'border-red-500 bg-red-100'
                : 'border-gray-300'
            }`}
            {...getInPutProps('password')}
          />
          {errors.password && touched.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className={`w-full p-3 mt-4 text-white font-bold rounded-lg text-lg transition-colors duration-300 
              ${
                isDisable
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#807BFF] hover:bg-[#6A63E0] cursor-pointer'
              }`}
            disabled={isDisable}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
