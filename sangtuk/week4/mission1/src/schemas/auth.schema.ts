import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.'),
});

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(6, '비밀번호는 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.'),
    passwordCheck: z
      .string()
      .min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

// 타입 추론 및 export
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
