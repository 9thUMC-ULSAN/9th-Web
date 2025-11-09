import { useEffect, useState } from 'react';
// 형식만 가져오는 import는 'type'을 명시합니다.
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfoDto } from '../types/auth';

const MyPage = () => {
  // 🚨 최종 수정: ResponseMyInfoDto 또는 null이 들어갈 수 있음을 명확히 명시합니다.
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  // useEffect 및 API 호출 로직
  useEffect(() => {
    const getData = async () => {
      try {
        // response의 타입은 그대로 유지
        const response: ResponseMyInfoDto = await getMyInfo();
        console.log('나의 정보 응답:', response);

        // 타입 오류 해결: 객체 할당 가능
        setData(response);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setData(null);
      }
    };

    getData();
  }, []); // 의존성 배열은 그대로 유지

  // 런타임 오류 방지: data가 null일 때 data.data.name에 접근하는 오류 해결
  if (!data || !data.data || !data.data.name) {
    return <div>로딩 중...</div>;
  }

  console.log(data.data.name);
  return <div>{data.data.name}</div>;
};

export default MyPage;
