import { z, type ZodType } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoginLayout from '../../components/LoginLayout'; // 임시
import Input from '../../components/Input'; // 임시
import Button from '../../components/Button'; // 임시
import { postSignup } from '../../api/auth'; // 임시 (영상 [00:32:31] 참고)

// Zod 스키마 정의 (비밀번호 확인 로직 포함)
const schema = z
  .object({
    email: z.string().email({
      message: '올바른 이메일 형식이 아닙니다.',
    }),
    password: z
      .string()
      .minLength(8, {
        message: '비밀번호는 8자 이상이어야 합니다.',
      })
      .max(20, {
        message: '비밀번호는 20자 이하여야 합니다.',
      }),
    name: z.string().min(1, { message: '이름을 입력해주세요' }),
    passwordCheck: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요' }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  }); 
type FormFields = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onBlur', 
    defaultValues: {
      email: '',
      password: '',
      passwordCheck: '',
      name: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck, ...rest } = data; 

      const response = await postSignup(rest); 
    } catch (error) {
      alert(error.message);
    }
  }; // [00:13:04]

  return (
    <LoginLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 입력 필드 */}
        <Input
          label="이름"
          type="text"
          {...register('name')} 
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name.message}</div>
        )}

        {/* 이메일 입력 필드 */}
        <Input
          label="이메일"
          type="email"
          {...register('email')} 
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}

        {/* 비밀번호 입력 필드 */}
        <Input label="비밀번호" type="password" {...register('password')} />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

        {/* 비밀번호 확인 입력 필드 */}
        <Input
          label="비밀번호 확인"
          type="password"
          {...register('passwordCheck')}        />
        {errors.passwordCheck && (
          <div className="text-red-500 text-sm">
            {errors.passwordCheck.message}
          </div>
        )}

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          회원 가입 
        </Button>
      </form>
    </LoginLayout>
  );
};

export default SignupPage;
