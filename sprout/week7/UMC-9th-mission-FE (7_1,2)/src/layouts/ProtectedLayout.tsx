// ProtectedLayout.tsx 수정

import Navbar from '../components/Navbar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!accessToken) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="h-dvh flex flex-col bg-black">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <main className="flex-1 mt-16 overflow-y-auto">
        <Outlet />
      </main>

      {/* 🚨 2. 아래의 <Footer /> 부분을 삭제하세요 */}
      {/* <Footer /> */}
    </div>
  );
};

export default ProtectedLayout;
