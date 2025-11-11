import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import Footer from "../components/Footer";

export default function HomeLayout() {
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMyInfo();
        console.log("getMyInfo 결과:", response); // 구조 확인용
        setUser(response);
      } catch (error) {
        console.error("사용자 정보를 불러오지 못했습니다:", error);
      }
    };
    fetchUser();
  }, []);


  return (
    <div className="h-dvh flex flex-col">
      <nav className="p-4 bg-gray-200 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">홈</Link>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
          <Link to="/my">마이페이지</Link>
        </div>
        {/* 로그인된 경우 이름 표시 */}
        {user?.data?.name && (
          <span className="text-gray-700 font-medium">
            {user.data.name} 님
          </span>
        )}
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
