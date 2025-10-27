import { Navigate, useNavigate } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

export default function LoginPage() {
    const navigate = useNavigate();
    const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken)
    const {values, errors, touched, getInpurtProps} = useForm<UserSigninInformation>({
        initialValue : {
            email: "",
            password: "",
        },
        validate: validateSignin
    });
    
    const handleSubmit = async() => { 
        console.log(values);
        try {
            const response = await postSignin(values);
            console.log(response);
            setItem(response.data.accessToken);
            navigate('/');
        } catch (error) {
            alert(error?.message)
        };
    };

    
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
        </div>
    </div>
  )
}
