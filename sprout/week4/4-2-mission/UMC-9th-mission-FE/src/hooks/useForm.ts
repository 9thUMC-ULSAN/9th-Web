import { useState, useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react'; // ChangeEvent를 type으로 가져옵니다.

// 폼 필드의 타입 정의
export interface FormValues {
  email: string;
  password: string;
}

// 유효성 검사 반환 타입
interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

// 유효성 검사 함수 타입
type Validator = (value: string) => ValidationResult;

// 유효성 검사 규칙 정의 (미션 2번 조건 충족)
const validators: Record<keyof FormValues, Validator> = {
  email: (value: string) => {
    // 2. 이메일 유효성 검사 (유효하지 않은 이메일 형식)
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return {
      isValid,
      errorMessage: isValid ? '' : '유효하지 않은 이메일 형식입니다.',
    };
  },
  password: (value: string) => {
    // 2. 비밀번호 길이 검사 (최소 6자 이상)
    const isValid = value.length >= 6;
    return {
      isValid,
      errorMessage: isValid ? '' : '비밀번호는 최소 6자 이상이어야 합니다.',
    };
  },
};

/**
 * useForm 커스텀 훅: 폼 데이터와 유효성 검사 상태를 관리합니다.
 * @param {FormValues} initialValues - 폼 필드의 초기 값
 */
const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormValues>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key as keyof FormValues]: '' }),
      {} as FormValues
    )
  );

  // 3. 로그인 버튼 활성화 로직 구현
  const isFormValid = useMemo(() => {
    return Object.keys(values).every((key) => {
      const fieldKey = key as keyof FormValues;
      // 1. 값이 비어있지 않고
      if (!values[fieldKey]) return false;
      // 2. 해당 필드의 유효성 검사 통과
      return (
        validators[fieldKey] && validators[fieldKey](values[fieldKey]).isValid
      );
    });
  }, [values]);

  // 입력 필드 값 변경 핸들러
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormValues;

    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));

    // 입력 즉시 유효성 검사 (에러 메시지 업데이트)
    if (validators[fieldName]) {
      const { errorMessage } = validators[fieldName](value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMessage,
      }));
    }
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (callback: (values: FormValues) => void) => (e: React.FormEvent) => {
      e.preventDefault();

      // 최종 유효성 검사
      let hasError = false;
      const newErrors: FormValues = { ...errors };

      Object.keys(values).forEach((key) => {
        const fieldKey = key as keyof FormValues;
        if (validators[fieldKey]) {
          const { errorMessage } = validators[fieldKey](values[fieldKey]);
          newErrors[fieldKey] = errorMessage;
          if (errorMessage) {
            hasError = true;
          }
        }
      });

      setErrors(newErrors);

      if (isFormValid && !hasError) {
        callback(values);
      } else {
        console.log('로그인 실패: 유효성 검사 오류');
      }
    },
    [values, isFormValid, errors]
  );

  return {
    values,
    errors,
    isFormValid,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
