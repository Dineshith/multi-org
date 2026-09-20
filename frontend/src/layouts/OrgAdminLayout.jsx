import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Calendar, Image as ImageIcon, Settings, LogOut, Users } from 'lucide-react';
import { getOrganization } from '../services/mockDbService';

const OrgAdminLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    if (user && user.organizationId) {
      setOrganization(getOrganization(user.organizationId));
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (user.role !== 'ORG_ADMIN' && user.role !== 'EDITOR') {
    return <Navigate to="/platform-admin" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pages', path: '/admin/dashboard/pages', icon: FileText },
    { name: 'Notices', path: '/admin/dashboard/notices', icon: FileText },
    { name: 'Events', path: '/admin/dashboard/events', icon: Calendar },
    { name: 'Staff', path: '/admin/dashboard/staff', icon: Users },
    { name: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
          {organization?.branding?.logo ? (
            <img src={organization.branding.logo} alt="Logo" className="w-10 h-10 rounded-md object-cover" />
          ) : (
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center font-bold text-xl">
              {organization?.name?.charAt(0) || 'O'}
            </div>
          )}
          <div>
            <h1 className="font-bold text-gray-900 leading-tight line-clamp-1">{organization?.name || 'Organization'}</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin/dashboard');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
             <Link to={`/org/${organization?.slug}`} target="_blank" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
               View Live Site ↗
             </Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OrgAdminLayout;
