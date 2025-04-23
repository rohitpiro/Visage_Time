import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  UserPlus, 
  ClipboardCheck, 
  BarChart3, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Layout = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { path: '/attendance', label: 'Attendance', icon: <ClipboardCheck className="h-5 w-5 mr-2" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
  ];

  if (isAdmin) {
    navItems.splice(1, 0, { 
      path: '/register', 
      label: 'Register Users', 
      icon: <UserPlus className="h-5 w-5 mr-2" /> 
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold text-brand-700">VisageTime</h1>
          <button 
            className="p-1 rounded-md lg:hidden hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2 rounded-md transition-colors w-full",
                isActive 
                  ? "bg-brand-50 text-brand-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={closeSidebar}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-4 px-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
                {currentUser?.name.charAt(0)}
              </div>
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden">
        <header className="h-16 bg-white shadow-sm z-10 flex items-center px-4">
          <button 
            className="p-1 mr-4 rounded-md lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Facial Recognition Attendance</h2>
        </header>

        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
