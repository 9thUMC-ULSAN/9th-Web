import { useState, ChangeEvent, FormEvent } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * 폼 상태를 관리하는 커스텀 훅
 * @param initialValues 폼의 초기값
 * @param validate 유효성 검사 함수 (선택)
 * @param onSubmit 폼 제출 핸들러
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 값이 변경되면 해당 필드를 touched로 표시
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // 실시간 유효성 검사
    if (validate && touched[name as keyof T]) {
      const newErrors = validate({
        ...values,
        [name]: value,
      });
      setErrors(newErrors);
    }
  };

  // Blur 이벤트 핸들러
  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Blur 시 유효성 검사
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 필드를 touched로 표시
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);

    // 유효성 검사
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);

      // 에러가 있으면 제출하지 않음
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }

    // 제출 처리
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // 특정 필드 에러 설정
  const setFieldError = (field: keyof T, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  // 특정 필드 값 설정
  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    setFieldValue,
  };
}
