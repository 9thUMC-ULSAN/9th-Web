import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T;
    // 값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initialValue, validate } : UseFormProps<T>){
    const [values, setValues] = useState(initialValue);
    const [touched, setTouched] = useState<Record<string, boolean>>();
    const [errors, setErrors] = useState<Record<string, string>>();

    // 사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, // 불변성 유지 (기존 입력값 유지)
            [name] : text,
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        })
    }

    // 이메일 인풋, 패스워드 인풋 등 속성들을 가져온다.
    const getInpurtProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur}
    };

    // values가 변경될 떄마다 에러 검증 로직이 실행됨
    useEffect(() => {
        const newErrors: Record<keyof T, string> = validate(values);
        setErrors(newErrors); // 오류 메세지 업데이트
        }, [validate, values]);
    return { values, errors, touched, getInpurtProps };
}

export default useForm;