import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export default function Layout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      <Outlet />
    </div>
  );
}
