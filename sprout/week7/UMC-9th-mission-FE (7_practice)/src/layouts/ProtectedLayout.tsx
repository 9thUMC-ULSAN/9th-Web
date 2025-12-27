import Footer from '../components/Footer.tsx';
import Navbar from '../components/Navbar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 mt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
