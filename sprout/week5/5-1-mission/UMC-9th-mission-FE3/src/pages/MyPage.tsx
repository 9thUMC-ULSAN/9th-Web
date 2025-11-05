import { useEffect, useState } from 'react'; // React, useEffect, useState 임포트
import type { ResponseMyInfoDto } from '../types/auth'; // ResponseMyInfoDto 타입만 임포트
import { getMyInfo } from '../apis/auth'; // API 호출 함수 임포트
import { useAuth } from '../context/AuthContext'; // useAuth 훅 임포트

// 내 정보 데이터 구조
interface MyInfoData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

const initialState: MyInfoData | null = null;

const MyPage = () => {
  const { accessToken } = useAuth(); // 토큰 유무 확인 (선택 사항이지만 유용)
  const [data, setData] = useState<MyInfoData | null>(initialState);

  useEffect(() => {
    const getData = async () => {
      // 1. 토큰이 없는 경우 API 요청을 하지 않음 (ProtectedLayout에서 이미 막지만, 안전 장치)
      if (!accessToken) return;

      try {
        // getMyInfo가 ResponseMyInfoDto 타입을 반환하므로,
        // response 자체가 data 타입입니다. (이전 오류 해결)
        const response: ResponseMyInfoDto = await getMyInfo();

        // ResponseMyInfoDto에 data 속성이 없으므로 response를 직접 사용
        setData(response);
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
      }
    };

    getData();
  }, [accessToken]); // accessToken이 변경될 때마다 데이터를 다시 불러옴

  if (!data) {
    return <div>로딩 중이거나 로그인 정보가 없습니다...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">마이 페이지</h1>
      <p>이름: {data.name}</p>
      <p>이메일: {data.email}</p>
      <p>자기소개: {data.bio || '작성된 소개가 없습니다.'}</p>
    </div>
  );
};

export default MyPage;
