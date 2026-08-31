import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Settings,
  LogOut,
  Bell,
  ClipboardCheck
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Organizations', path: '/organizations' },
  { icon: Users, label: 'User Management', path: '/users' },
  { icon: GraduationCap, label: 'Academics', path: '/academics' },
  { icon: BookOpen, label: 'Students', path: '/students' },
  { icon: CreditCard, label: 'Finance', path: '/finance' },
  { icon: ClipboardCheck, label: 'Results', path: '/results' },
  { icon: Bell, label: 'Notice', path: '/notice' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0b1329] text-white flex flex-col h-screen fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide">Main Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Platform Control</div>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <NavLink 
              key={item.label}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="font-medium text-[0.95rem]">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-inner">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Super Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@system.com</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
