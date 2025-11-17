import { Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Navbar } from '../components/Navbar';


const MovieLayout = (): ReactElement => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar /> 
      <Outlet />
    </div>
  );
};

export default MovieLayout;