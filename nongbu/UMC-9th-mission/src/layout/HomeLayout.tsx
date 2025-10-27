import { Outlet, Link } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="h-dvh flex flex-col">
        <nav className="p-4 bg-gray-200 flex gap-4">
            <Link to="/">홈</Link>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
            <Link to="/my">마이페이지</Link>
        </nav>
        <main className="flex-1 p-4">
            <Outlet/>
        </main>
        <footer className="p-4 bg-gray-300 text-center">푸터</footer>
    </div>
  )
}
