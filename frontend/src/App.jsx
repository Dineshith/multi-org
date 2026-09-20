import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Your frontend pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Research from './pages/Research';

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
import OASettings from './pages/OrgAdmin/Settings';

// Public Pages
import DynamicPage from './pages/Public/DynamicPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Your Akshar Frontend Pages */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col bg-white text-gray-900">
                <Navbar />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />

          <Route
            path="/research"
            element={
              <div className="min-h-screen flex flex-col bg-white text-gray-900">
                <Navbar />
                <main className="flex-1">
                  <Research />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Login */}
          <Route path="/admin" element={<Login />} />

          {/* Super Admin Routes */}
          <Route path="/platform-admin" element={<SuperAdminLayout />}>
            <Route index element={<SADashboard />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route path="organizations" element={<SAOrganizations />} />
            <Route
              path="users"
              element={
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  Users Management coming soon
                </div>
              }
            />
          </Route>

          {/* Organization Admin Routes */}
          <Route path="/admin/dashboard" element={<OrgAdminLayout />}>
            <Route index element={<OADashboard />} />
            <Route path="notices" element={<OANotices />} />
            <Route path="events" element={<OAEvents />} />
            <Route path="pages" element={<OAPages />} />
            <Route path="pages/:pageId" element={<OAPageBuilder />} />
            <Route
              path="staff"
              element={
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  Staff Management coming soon
                </div>
              }
            />
            <Route path="settings" element={<OASettings />} />
          </Route>

          {/* Public Organization Routes */}
          <Route
            path="/org/:slug"
            element={
              <TenantProvider>
                <PublicLayout />
              </TenantProvider>
            }
          >
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