import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth.ts';
import type { ResponseMyInfoDto } from '../types/auth.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { postlogout } from '../apis/auth'; // 로그아웃 API 호출을 위해 임포트 가정

// MyPage에서 사용할 데이터 타입을 정의합니다. (ResponseMyInfoDto와 로딩 상태를 위해 null 포함)
type MyPageData = ResponseMyInfoDto | null;

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Context의 logout 함수 사용

  // useState 초기값을 null로 설정합니다.
  const [data, setData] = useState<MyPageData>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        // [수정된 axios.ts 덕분에] 토큰이 헤더에 실려 안전하게 호출됩니다.
        const response: ResponseMyInfoDto = await getMyInfo();
        console.log('사용자 정보 로드 성공:', response);
        setData(response);
      } catch (error: any) {
        console.error('Failed to fetch user info:', error);
        // 401 에러 발생 시 로그아웃 처리 (ProtectedLayout이 리다이렉트 처리하지만, 혹시 모를 대비)
        if (error.response && error.response.status === 401) {
          await logout();
          navigate('/login', { replace: true });
        }
      }
    };

    getData();
  }, [logout, navigate]); // Context의 logout과 navigate를 의존성 배열에 추가

  const handleLogout = async () => {
    // Context의 logout 함수를 호출하여 로컬 스토리지와 Context 상태를 초기화합니다.
    await logout();
    // Context가 정리된 후, 홈 페이지로 이동합니다.
    navigate('/', { replace: true });
  };

  // 데이터 로딩 중일 때 처리
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-xl font-medium text-gray-700">
          사용자 정보를 불러오는 중입니다...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-10 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {data.data?.name}님 환영합니다.
      </h1>

      {/* 아바타 이미지 */}
      {data.data?.avator && (
        <img
          src={data.data.avator as string}
          alt={'사용자 아바타 (구글 로고)'}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/96x96/60A5FA/ffffff?text=User'; // 이미지 로드 실패 시 대체 이미지
          }}
        />
      )}

      <h1 className="text-lg text-gray-600 mb-6 font-mono">
        {data.data?.email}
      </h1>

      <button
        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
