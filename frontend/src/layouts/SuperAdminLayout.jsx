import React, { useState } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, Settings, LogOut, LayoutDashboard, ChevronDown, ChevronRight, KeyRound, Menu, X } from 'lucide-react';

const SuperAdminLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/platform-admin', icon: LayoutDashboard },
    { name: 'Platform Pages', path: '/platform-admin/pages', icon: LayoutDashboard }, // Added Pages
    { 
      name: 'Organizations', 
      icon: Building2,
      children: [
        { name: 'All Organizations', path: '/platform-admin/organizations', icon: Building2 },
        { name: 'Password Requests', path: '/platform-admin/password-requests', icon: KeyRound },
      ]
    },
  ];

  const [openMenus, setOpenMenus] = useState({
    'Organizations': true // Open by default or based on active path later
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">EDU<span className="text-blue-400">CMS</span></h1>
            <p className="text-xs text-slate-400 mt-1">Super Admin Portal</p>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive = !hasChildren && (location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/platform-admin'));
            
            // For parent menu of active child
            const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path || location.pathname.startsWith(child.path));
            
            // isOpen strictly follows the toggle state
            const isOpen = openMenus[item.name];
            
            const Icon = item.icon;
            
            if (hasChildren) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      isChildActive ? 'text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className={isChildActive ? 'text-blue-400' : ''} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {isOpen && (
                    <div className="pl-11 pr-2 space-y-1 pb-2">
                      {item.children.map(child => {
                        const childActive = location.pathname === child.path || location.pathname.startsWith(child.path);
                        const ChildIcon = child.icon || LayoutDashboard; // Fallback icon
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when navigating
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              childActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <ChildIcon size={16} />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when navigating
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/platform-admin/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 mb-4 px-2 hover:bg-slate-800 rounded-lg py-2 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold group-hover:bg-blue-600 transition-colors overflow-hidden">
              {user.profile_photo_url ? (
                <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium group-hover:text-white transition-colors truncate">{user.name}</p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors truncate">{user.email}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
          <button 
            className="mr-4 lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {navItems.find(item => item.path === location.pathname)?.name || (location.pathname === '/platform-admin/settings' ? 'Platform Settings' : 'Super Admin')}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
