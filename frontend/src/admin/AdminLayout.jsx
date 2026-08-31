import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Bell, Search } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center text-slate-800">
            <h2 className="text-[1.3rem] font-bold">Admin Portal</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across organizations..."
                className="pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-[0.9rem] focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 w-72 transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="w-[1.15rem] h-[1.15rem]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
