import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import SAPasswordRequests from './pages/SuperAdmin/PasswordRequests';
import SAAssignAdmin from './pages/SuperAdmin/AssignAdmin';

import OADashboard from './pages/OrgAdmin/Dashboard';
import OANews from './pages/OrgAdmin/News';
import OANotices from './pages/OrgAdmin/Notices';
import OAEvents from './pages/OrgAdmin/Events';
import OAPages from './pages/OrgAdmin/Pages';
import OAPageBuilder from './pages/OrgAdmin/PageBuilder';
import OASettings from './pages/OrgAdmin/Settings';
import OAStaff from './pages/OrgAdmin/Staff';

// Public Pages
import DynamicPage from './pages/Public/DynamicPage';

// Removed PlatformLanding
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
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
            <Route path="password-requests" element={<SAPasswordRequests />} />
            <Route path="settings" element={<SASettings />} />
            <Route path="assign-admin" element={<SAAssignAdmin />} />

          </Route>

          {/* Organization Admin Routes */}
          <Route path="/admin/dashboard" element={<OrgAdminLayout />}>
            <Route index element={<OADashboard />} />
            <Route path="news" element={<OANews />} />
            <Route path="notices" element={<OANotices />} />
            <Route path="events" element={<OAEvents />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route path="staff" element={<OAStaff />} />
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
