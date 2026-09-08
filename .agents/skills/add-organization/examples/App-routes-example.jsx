// =============================================================
// EXAMPLE: App.jsx route additions for "bachelors" org
// Add these imports at the top + routes inside <Routes>
// =============================================================

// ---- Bachelors Org — Public Pages ----
import BachelorsHome from './organizations/bachelors/pages/HomePage';
import BachelorsAbout from './organizations/bachelors/pages/AboutPage';
import BachelorsContact from './organizations/bachelors/pages/ContactPage';

// ---- Bachelors Org — Admin ----
import BachelorsAdminLayout from './organizations/bachelors/admin/layout/BachelorsAdminLayout';
import BachelorsDashboard from './organizations/bachelors/admin/pages/Dashboard';
import BachelorsStudentManagement from './organizations/bachelors/admin/pages/StudentManagement';
import BachelorsNoticeManagement from './organizations/bachelors/admin/pages/NoticeManagement';
import BachelorsResultManagement from './organizations/bachelors/admin/pages/ResultManagement';

// =============================================================
// Inside the <Routes> block in App.jsx, add:
// =============================================================

{/* ================= BACHELORS PUBLIC SITE ================= */}
<Route path="/bachelors" element={<BachelorsHome />} />
<Route path="/bachelors/about" element={<BachelorsAbout />} />
<Route path="/bachelors/contact" element={<BachelorsContact />} />

{/* ================= BACHELORS ADMIN ================= */}
<Route path="/bachelors/admin" element={<BachelorsAdminLayout />}>
  <Route index element={<BachelorsDashboard />} />
  <Route path="students" element={<BachelorsStudentManagement />} />
  <Route path="notices" element={<BachelorsNoticeManagement />} />
  <Route path="results" element={<BachelorsResultManagement />} />
  <Route path="*" element={<BachelorsDashboard />} />
</Route>
