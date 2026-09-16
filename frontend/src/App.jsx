import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';

// Existing Project Imports
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import ResultCheck from './pages/ResultCheck';

// Bachelor Project Imports
import BachelorHome from './bachelor/pages/Home';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import UserManagement from './admin/pages/UserManagement';
import ResultManagement from './admin/pages/ResultManagement';
import MarksEntry from './admin/pages/results/MarksEntry';
import ViewLedger from './admin/pages/results/ViewLedger';
import SubjectSetup from './admin/pages/results/SubjectSetup';
import PublishResult from './admin/pages/results/PublishResult';
import AdminLogin from './admin/pages/AdminLogin';
import CMSManagement from './admin/pages/cms/CMSManagement';

// CMS Imports
import MainPortalHomeHero from './admin/pages/cms/mainportal/home/Hero';
import MainPortalHomeGallery from './admin/pages/cms/mainportal/home/Gallery';
import MainPortalResearchHero from './admin/pages/cms/mainportal/research/Hero';
import MainPortalAcademicLeadership from './admin/pages/cms/mainportal/faculty/AcademicLeadership';
import MainPortalFooter from './admin/pages/cms/mainportal/Footer';

// School imports
import SchoolNavbar from './school/components/Navbar';
import SchoolHome from './school/pages/Home';
import AboutUs from './school/pages/AboutUs';
import SchoolContact from './school/components/Contact';
import Teachers from './school/pages/Teachers';
import FacultyMessages from './school/pages/FacultyMessages';
import Administrators from './school/pages/Administrators';
import SchoolGallery from './school/pages/Gallery';
import GalleryDetail from './school/pages/GalleryDetail';
import Events from './school/pages/Events';
import Scholarship from './school/pages/Scholarship';

import './school/school.css';

function App() {
  return (
    <div className="w-full max-w-full m-0 p-0 bg-white min-h-screen flex flex-col">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/results" element={<ResultCheck />} />

        {/* Bachelor (College) Routes */}
        <Route path="/bachelor" element={<BachelorHome />} />
        <Route path="/bachelor/*" element={<BachelorHome />} />
        <Route path="/bachelors" element={<Navigate to="/bachelor" replace />} />
        <Route path="/bachelors/*" element={<Navigate to="/bachelor" replace />} />
        <Route path="/college" element={<Navigate to="/bachelor" replace />} />

        {/* School Project Routes */}
        <Route
          path="/school/*"
          element={
            <div className="school-font text-gray-900 bg-white w-full">
              <SchoolNavbar />
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="/home" element={<SchoolHome />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<SchoolContact />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/faculty-messages" element={<FacultyMessages />} />
                <Route path="/administrators" element={<Administrators />} />
                <Route path="/administration" element={<Administrators />} />
                <Route path="/gallery" element={<SchoolGallery />} />
                <Route path="/gallery/:id" element={<GalleryDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/scholarship" element={<Scholarship />} />
              </Routes>
            </div>
          }
        />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="results" element={<ResultManagement />}>
            <Route index element={<Navigate to="entry" replace />} />
            <Route path="entry" element={<MarksEntry />} />
            <Route path="ledger" element={<ViewLedger />} />
            <Route path="setup" element={<SubjectSetup />} />
            <Route path="publish" element={<PublishResult />} />
          </Route>
          <Route path="cms" element={<CMSManagement />}>
            <Route index element={<Navigate to="main-hero" replace />} />
            <Route path="main-hero" element={<MainPortalHomeHero />} />
            <Route path="main-gallery" element={<MainPortalHomeGallery />} />
            <Route path="research-hero" element={<MainPortalResearchHero />} />
            <Route path="faculty-leadership" element={<MainPortalAcademicLeadership />} />
            <Route path="footer" element={<MainPortalFooter />} />
          </Route>
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
