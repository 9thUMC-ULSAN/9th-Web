import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";

import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const {values, errors, touched, getInpurtProps} = useForm<UserSigninInformation>({
        initialValue : {
            email: "",
            password: "",
        },
        validate: validateSignin
    });
    
    const handleSubmit = async() => { 
        await login(values);
    };
    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    
    // 오류가 하나라도 있거나, 입력값이 있으면 버튼을 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "");
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex flex-col gap-3">
            <input
                {...getInpurtProps("email")}
                name="email"
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"email"}
                placeholder={"이메일"}
            />
            {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}
            <input
                {...getInpurtProps("password")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg
                    ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"비밀번호"}
            />
            {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}
            <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isDisabled} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-color cursor-pointer disabled:bg-gray-300"
            >로그인</button>
            <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-color cursor-pointer disabled:bg-gray-300"
            >
                <div className="flex items-center justify-center gap-4">
                    <img src={'/images/google1.png'} alt="Google Logo Image"/>
                    <span>구글 로그인</span>
                </div>
                </button>
        </div>
    </div>
  )
}
