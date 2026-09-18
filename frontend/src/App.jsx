import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Layouts
import SuperAdminLayout from './layouts/SuperAdminLayout';
import OrgAdminLayout from './layouts/OrgAdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Auth
import Login from './pages/Auth/Login';

// Super Admin Pages
import SADashboard from './pages/SuperAdmin/Dashboard';
import SAOrganizations from './pages/SuperAdmin/Organizations';

// Org Admin Pages
import OADashboard from './pages/OrgAdmin/Dashboard';
import OANotices from './pages/OrgAdmin/Notices';
import OAEvents from './pages/OrgAdmin/Events';
import OAPages from './pages/OrgAdmin/Pages';
import OAPageBuilder from './pages/OrgAdmin/PageBuilder';

// Public Pages
import DynamicPage from './pages/Public/DynamicPage';

// Main Landing
const PlatformLanding = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
    <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-center">
      Welcome to EDU<span className="text-blue-500">CMS</span> Platform
    </h1>
    <p className="text-xl text-slate-400 max-w-2xl text-center mb-8">
      A Multi-Tenant Content Management System for Educational Institutions.
    </p>
    <div className="flex gap-4">
      <a href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        Login to Portal
      </a>
      <a href="/org/abc-college" className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-medium rounded-lg transition-colors">
        View Demo College
      </a>
      <a href="/org/xyz-school" className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-medium rounded-lg transition-colors">
        View Demo School
      </a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PlatformLanding />} />
          <Route path="/login" element={<Login />} />

          {/* Super Admin Routes */}
          <Route path="/platform-admin" element={<SuperAdminLayout />}>
            <Route index element={<SADashboard />} />
            <Route path="organizations" element={<SAOrganizations />} />
            <Route path="users" element={<div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">Users Management coming soon</div>} />
          </Route>

          {/* Organization Admin Routes */}
          <Route path="/admin" element={<OrgAdminLayout />}>
            <Route index element={<OADashboard />} />
            <Route path="notices" element={<OANotices />} />
            <Route path="events" element={<OAEvents />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route path="staff" element={<div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">Staff Management coming soon</div>} />
          </Route>

          {/* Public Organization Routes */}
          <Route path="/org/:slug" element={
            <TenantProvider>
              <PublicLayout />
            </TenantProvider>
          }>
            {/* The index route represents /org/:slug and DynamicPage handles it by defaulting to 'home' */}
            <Route index element={<DynamicPage />} />
            <Route path=":pageSlug" element={<DynamicPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
