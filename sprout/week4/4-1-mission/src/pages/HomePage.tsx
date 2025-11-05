import { Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Navbar } from '../components/Navbar';

const HomePage = (): ReactElement => {
  return (
    // 배경색을 다크 모드로 설정하여 일관성을 높입니다.
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomePage;
