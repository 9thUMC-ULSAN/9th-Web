import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export default function Layout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
    </div>
  );
}
