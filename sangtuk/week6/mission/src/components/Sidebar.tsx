import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '전체 LP', icon: '🏠' },
    { path: '/my-lps', label: '내 LP', icon: '📀' },
    { path: '/favorites', label: '좋아요', icon: '❤️' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-black border-r border-gray-800 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button onClick={() => handleNavigation(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${location.pathname === item.path ? 'bg-pink-500/10 text-pink-500' : 'text-gray-300 hover:bg-gray-800'}`}>
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="my-4 border-t border-gray-800" />
        <ul className="space-y-2">
          <li>
            <button onClick={() => handleNavigation('/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors font-medium">
              <span className="text-xl">⚙️</span>
              <span>설정</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
