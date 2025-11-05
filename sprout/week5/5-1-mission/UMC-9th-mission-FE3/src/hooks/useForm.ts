import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react'; // type import로 수정

// 폼의 입력 필드 타입을 정의하는 제네릭 T
interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

// 터치 여부를 저장하는 타입 (키는 string, 값은 boolean)
type Touched<T> = Record<keyof T, boolean>;
// 에러 메시지를 저장하는 타입 (키는 string, 값은 string)
type Errors<T> = Record<keyof T, string>;

// HTML 입력 요소의 변경 이벤트를 위한 유니온 타입
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

// useForm 커스텀 훅 정의
export const useForm = <T extends Record<string, unknown>>({
  initialValue,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValue);

  // Touched와 Errors의 초기값 설정 (T의 키를 기반으로 초기화)
  const [touched, setTouched] = useState<Touched<T>>(() => {
    const initialTouched: Partial<Touched<T>> = {};
    for (const key in initialValue) {
      initialTouched[key as keyof T] = false;
    }
    return initialTouched as Touched<T>;
  });

  const [errors, setErrors] = useState<Errors<T>>(() => {
    const initialErrors: Partial<Errors<T>> = {};
    for (const key in initialValue) {
      initialErrors[key as keyof T] = '';
    }
    return initialErrors as Errors<T>;
  });

  // 값이 변경될 때마다 유효성 검사 실행 (useEffect)
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values, validate]);

  // 입력 값 변경 핸들러
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name as keyof T]: value,
    }));
  };

  // 필드 포커스가 해제(블러)될 때 호출될 핸들러
  const handleBlur = (e: FormChangeEvent) => {
    const { name } = e.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name as keyof T]: true,
    }));
  };

  // 인풋 필드의 Props를 한 번에 반환하는 함수
  const getInputFieldProps = (name: keyof T) => ({
    name,
    value: values[name] as string,
    onChange: handleChange,
    onBlur: handleBlur,
  });

  // 외부 노출 값 반환
  return {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    getInputFieldProps,
    setValues,
    setTouched,
  };
};
