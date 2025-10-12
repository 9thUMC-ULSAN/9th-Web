import { useState, useCallback } from 'react';

// 폼 필드 타입 정의
export interface FormField {
  value: string;
  error: string;
}

// 폼 상태 타입 정의
export interface FormState {
  [key: string]: FormField;
}

// 유효성 검사 함수 타입 정의
export type ValidationFunction = (value: string) => string;

// useForm 훅의 반환 타입
export interface UseFormReturn {
  formState: FormState;
  updateField: (fieldName: string, value: string) => void;
  validateField: (fieldName: string, validationFn: ValidationFunction) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldValue: (fieldName: string) => string;
  getFieldError: (fieldName: string) => string;
  isFieldValid: (fieldName: string) => boolean;
  isFormValid: () => boolean;
}

// useForm 커스텀 훅
export const useForm = (initialFields: string[]): UseFormReturn => {
  // 초기 폼 상태 설정
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    initialFields.forEach(field => {
      initialState[field] = {
        value: '',
        error: ''
      };
    });
    return initialState;
  });

  // 필드 값 업데이트
  const updateField = useCallback((fieldName: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: '' // 값이 변경되면 에러 메시지 초기화
      }
    }));
  }, []);

  // 개별 필드 유효성 검사
  const validateField = useCallback((fieldName: string, validationFn: ValidationFunction) => {
    const field = formState[fieldName];
    if (!field) return;

    const error = validationFn(field.value);
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error
      }
    }));
  }, [formState]);

  // 전체 폼 유효성 검사
  const validateForm = useCallback(() => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(formState).forEach(fieldName => {
      const field = formState[fieldName];
      // 빈 값이 있으면 유효하지 않음
      if (!field.value.trim()) {
        newState[fieldName] = {
          ...field,
          error: `${fieldName}을(를) 입력해주세요.`
        };
        isValid = false;
      }
    });

    setFormState(newState);
    return isValid;
  }, [formState]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    const resetState: FormState = {};
    initialFields.forEach(field => {
      resetState[field] = {
        value: '',
        error: ''
      };
    });
    setFormState(resetState);
  }, [initialFields]);

  // 필드 값 가져오기
  const getFieldValue = useCallback((fieldName: string): string => {
    return formState[fieldName]?.value || '';
  }, [formState]);

  // 필드 에러 메시지 가져오기
  const getFieldError = useCallback((fieldName: string): string => {
    return formState[fieldName]?.error || '';
  }, [formState]);

  // 개별 필드 유효성 확인
  const isFieldValid = useCallback((fieldName: string): boolean => {
    const field = formState[fieldName];
    return !!(field?.value && !field?.error);
  }, [formState]);

  // 전체 폼 유효성 확인
  const isFormValid = useCallback((): boolean => {
    return Object.values(formState).every(field => 
      field.value.trim() !== '' && !field.error
    );
  }, [formState]);

  return {
    formState,
    updateField,
    validateField,
    validateForm,
    resetForm,
    getFieldValue,
    getFieldError,
    isFieldValid,
    isFormValid
  };
};
