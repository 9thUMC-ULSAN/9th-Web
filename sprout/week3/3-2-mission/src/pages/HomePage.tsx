import { Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Navbar } from '../components/Navbar';

const HomePage = (): ReactElement => {
  return (
    <>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default HomePage;
