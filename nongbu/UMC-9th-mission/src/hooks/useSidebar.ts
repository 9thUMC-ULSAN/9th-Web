import { useState, useEffect, useCallback } from "react";

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. 상태 변경 함수들 (Memoization으로 불필요한 재생성 방지)
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // 2. ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // 클린업 함수: 컴포넌트 언마운트 시 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // 3. 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 사이드바가 열리면 body의 overflow를 hidden으로 설정해 스크롤을 막음
      document.body.style.overflow = "hidden";
    } else {
      // 닫히면 원래대로 복구
      document.body.style.overflow = "unset";
    }

    // 클린업: 혹시 모를 상황 대비하여 스타일 초기화
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
};

export default useSidebar;