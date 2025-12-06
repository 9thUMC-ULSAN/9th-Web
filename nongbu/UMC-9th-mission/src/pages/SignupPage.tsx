import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import type { SubmitHandler } from "react-hook-form";
import type { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";


const schema = z.object({
    email: z.string().email({message : "올바른 이메일 형식이 아닙니다."}),
    password: z
    .string()
    .min(8, {
        message : "비밀번호는 8자 이상이여야합니다.",
    })
    .max(20, {
        message : "비밀번호는 20자 이하여야합니다.",
    }),
    passwordCheck: z
    .string()
    .min(8, {
        message : "비밀번호는 8자 이상이여야합니다.",
    })
    .max(20, {
        message : "비밀번호는 20자 이하여야합니다.",
    }),
    name: z.string().min(1, {message : "이름을 입력해주세요."})
})
.refine((data)=> data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다. ",
        path: ['passwordCheck']
    })

type FormFields = z.infer<typeof schema>;

export default function SignupPage() {
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState : {errors, isSubmitting}} = useForm<FormFields>({
        defaultValues : {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const onSubmit : SubmitHandler<FormFields> = async(data) => {
        const {passwordCheck, ...rest} = data;

        const response = await postSignup(rest);
        console.log(response)
        navigate('/');
    }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <input
                {...register("name")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"text"}
                placeholder={"이름"}
            />
            {errors.name && 
                (<div className={'text-red-500 text-sm'}>{errors.name.message}</div>
            )}
            <input
                {...register("email")}
                name="email"
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.email  ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"email"}
                placeholder={"이메일"}
            />
            {errors.email && 
                (<div className={'text-red-500 text-sm'}>{errors.email.message}</div>
            )}
            <input
                {...register("password")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"비밀번호"}
            />
            {errors.password && 
                (<div className={'text-red-500 text-sm'}>{errors.password.message}</div>
            )}
            <input
                {...register("passwordCheck")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"비밀번호 확인"}
            />
            
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-color cursor-pointer disabled:bg-gray-300"
            >회원가입</button>
        </form>
    </div>
  )
}
