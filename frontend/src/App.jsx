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
import ForgetPassword from './pages/Auth/ForgetPassword';

// Super Admin Pages
import SADashboard from './pages/SuperAdmin/Dashboard';
import SAOrganizations from './pages/SuperAdmin/Organizations';
import SASettings from './pages/SuperAdmin/Setting';

// Org Admin Pages
import OADashboard from './pages/OrgAdmin/Dashboard';
import OANotices from './pages/OrgAdmin/Notices';
import OAEvents from './pages/OrgAdmin/Events';
import OAPages from './pages/OrgAdmin/Pages';
import OAPageBuilder from './pages/OrgAdmin/PageBuilder';
import OASettings from './pages/OrgAdmin/Settings';

// Public Pages
import DynamicPage from './pages/Public/DynamicPage';

// Removed PlatformLanding
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/org/main-portal" replace />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgetPassword />} />

          {/* Super Admin Routes */}
          <Route path="/platform-admin" element={<SuperAdminLayout />}>
            <Route index element={<SADashboard />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route path="organizations" element={<SAOrganizations />} />
            <Route path="settings" element={<SASettings />} />
          </Route>

          {/* Organization Admin Routes */}
          <Route path="/admin/dashboard" element={<OrgAdminLayout />}>
            <Route index element={<OADashboard />} />
            <Route path="notices" element={<OANotices />} />
            <Route path="events" element={<OAEvents />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route path="staff" element={<div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">Staff Management coming soon</div>} />
            <Route path="settings" element={<OASettings />} />
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
