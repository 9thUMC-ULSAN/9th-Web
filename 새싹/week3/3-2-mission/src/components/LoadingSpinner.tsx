import type { ReactElement } from 'react';

// 1. 컴포넌트 반환 타입을 ReactElement로 정확하게 수정했습니다.
//    (❌ Element -> ⭕️ ReactElement)
export const LoadingSpinner = (): ReactElement => {
  return (
    <div
      // 2. 'calssName' 오타를 'className'으로 수정했습니다.
      className="size-12 animate-spin rounded-full border-4 
      border-t-transparent border-[#dda5e3]" // MoviePage에서 사용된 색상(#dda5e3)을 기반으로 임시 지정
      role="status"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
    // 3. 닫는 괄호(;) 앞에 불필요한 괄호 ')'를 제거했습니다.
  );
};
