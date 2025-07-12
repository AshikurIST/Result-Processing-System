import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Students', path: '/admin/students', icon: '👨‍🎓' },
    { name: 'Courses', path: '/admin/courses', icon: '📚' },
    { name: 'Results', path: '/admin/results', icon: '📝' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-indigo-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          <h2 className={`${isOpen ? 'block' : 'hidden'} font-bold text-xl`}>Admin Panel</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-indigo-700 focus:outline-none"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-4 py-2">
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    location.pathname === item.path
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-200 hover:bg-indigo-700'
                  } rounded-md p-2 transition-colors duration-200`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-indigo-200 hover:bg-indigo-700 rounded-md p-2 transition-colors duration-200"
          >
            <span className="text-xl">🚪</span>
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Toggle button for mobile */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-indigo-600 rounded-md text-white focus:outline-none"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 