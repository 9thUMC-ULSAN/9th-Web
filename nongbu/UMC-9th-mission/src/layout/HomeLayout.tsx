import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function HomeLayout() {
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMyInfo();
        console.log("getMyInfo 결과:", response); 
        setUser(response);
      } catch (error) {
        console.error("사용자 정보를 불러오지 못했습니다:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="h-dvh flex flex-col">
      {/* 여기에 Navbar 컴포넌트 사용 (user 정보를 prop으로 전달) */}
      <Navbar user={user} />

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}