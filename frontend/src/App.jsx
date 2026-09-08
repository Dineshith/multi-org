import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';

// ---- Main Org ----
import Home from './organizations/main/pages/Home';
import FacultyPage from './organizations/main/pages/FacultyPage';
import AboutPage from './organizations/main/pages/AboutPage';
import ContactPage from './organizations/main/pages/ContactPage';
import ResearchPage from './organizations/main/pages/ResearchPage';

// ---- Plus2 Org ----
import PlusTwoHome from './organizations/plus2/pages/HomePage';
import PlusTwoAbout from './organizations/plus2/pages/AboutPage';
import PlusTwoContact from './organizations/plus2/pages/ContactPage';

// ---- Admin (Super-Admin) ----
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import ResultManagement from './admin/pages/ResultManagement';
import Gallery from './admin/pages/Gallery';

function App() {
  return (
    <div className="w-full max-w-full m-0 p-0 bg-white min-h-screen flex flex-col">
      <Routes>

        {/* ================= MAIN WEBSITE ================= */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/research" element={<ResearchPage />} />

        {/* ================= +2 WEBSITE ================= */}
        <Route path="/plus2" element={<PlusTwoHome />} />
        <Route path="/plus2/about" element={<PlusTwoAbout />} />
        <Route path="/plus2/contact" element={<PlusTwoContact />} />

        {/* ================= ADMIN ================= */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="results" element={<ResultManagement />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </div>
  );
}

export default App;
