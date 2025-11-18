import { useEffect, useState, type ChangeEvent } from 'react';

// 인터페이스의 이름을 UseformProps에서 UseFormProps로 PascalCase를 사용하여 수정했습니다.
interface UseFormProps<T> {
  initialValue: T;
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

// 함수 이름과 제네릭 타입 T를 명확히 지정하고 validate 오타를 수정했습니다.
function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  // 1. values 상태를 정확히 선언합니다.
  const [values, setValues] = useState(initialValue);

  // 2. touched 상태를 선언합니다. handleBlur에서 사용되며, keyof T를 타입으로 사용합니다.
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );

  // 3. errors 상태를 선언합니다. keyof T를 타입으로 사용합니다.
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  // 사용자가 입력값을 바꿀 때 실행되는 함수입니다.
  const handleChange = (name: keyof T, text: string) => {
    // setValues 호출 시 불변성을 유지합니다.
    setValues((prevValues) => ({
      ...prevValues, // 불변성 유지 (기존 값 유지)
      [name]: text,
    }));
  };

  // 인풋에서 포커스를 잃었을 때 (blur) 실행되어 touched 상태를 업데이트합니다.
  const handleBlur = (name: keyof T) => {
    // setTouched 호출 시 불변성을 유지합니다.
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  // 이메일 인풋, 패스워드 인풋 등의 속성들을 가져오는 함수입니다.
  const getInputProps = (name: keyof T) => {
    const value = values[name];

    // ChangeEvent를 react에서 import했습니다.
    // e.target.value의 타입을 정확히 지정합니다.
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  // value가 변경될 때마다 에러 검증 로직이 실행됩니다.
  useEffect(() => {
    const newErrors: Record<keyof T, string> = validate(values);
    setErrors(newErrors); // 오류 메시지 업데이트
  }, [validate, values]);

  // return 문을 함수 내부에 배치합니다.
  return { values, errors, touched, getInputProps };
}

// export default 문을 파일 최하단에 배치합니다.
export default useForm;
