import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';

// Existing Project Imports
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResearchPage from './pages/ResearchPage';

// Bachelor Project Imports
import BachelorHome from './bachelor/pages/Home';
import BachelorAbout from './bachelor/pages/About';
import BachelorPrograms from './bachelor/pages/Programs';
import BachelorFaculty from './bachelor/pages/Faculty';
import BachelorNotice from './bachelor/pages/Notice';
import BachelorGallery from './bachelor/pages/Gallery';
import BachelorContact from './bachelor/pages/Contact';
import BachelorResults from './bachelor/pages/Results';
import BachelorNavbar from './bachelor/components/Navbar';
import BachelorFooter from './bachelor/components/Footer';

// Plus2 Imports
import Plus2Navbar from './plus2/component/Navbar';
import Plus2Footer from './plus2/component/Footer';
import Plus2GalleryPage from './plus2/pages/GalleryPage';
import Plus2Scholarship from './plus2/pages/Scholarship';
import Plus2FeeStructure from './plus2/pages/FeeStructure';
import Plus2Contact from './plus2/pages/Contact';


// Admin imports
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import ResultManagement from './admin/pages/ResultManagement';
import AdminGallery from './admin/pages/Gallery';
import AdminLogin from './admin/pages/AdminLogin';
import OrganizationManagement from './admin/pages/OrganizationManagement';


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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/research" element={<ResearchPage />} />

        {/* Bachelor (College) Routes */}
        <Route
          path="/bachelor/*"
          element={
            <div className="w-full min-h-screen bg-white text-gray-900 font-sans flex flex-col">
              <BachelorNavbar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route index element={<BachelorHome />} />
                  <Route path="about" element={<BachelorAbout />} />
                  <Route path="programs" element={<BachelorPrograms />} />
                  <Route path="faculty" element={<BachelorFaculty />} />
                  <Route path="notice" element={<BachelorNotice />} />
                  <Route path="gallery" element={<BachelorGallery />} />
                  <Route path="contact" element={<BachelorContact />} />
                  <Route path="results" element={<BachelorResults />} />
                  <Route path="*" element={<Navigate to="/bachelor" replace />} />
                </Routes>
              </main>
              <BachelorFooter />
            </div>
          }
        />
        <Route path="/bachelors" element={<Navigate to="/bachelor" replace />} />
        <Route path="/bachelors/*" element={<Navigate to="/bachelor" replace />} />
        <Route path="/college" element={<Navigate to="/bachelor" replace />} />
        <Route path="/college/*" element={<Navigate to="/bachelor" replace />} />

        {/* Plus2 (Higher Secondary) Routes */}
        <Route
          path="/plus2/*"
          element={
            <div className="w-full min-h-screen bg-white text-gray-900 font-sans flex flex-col">
              <Plus2Navbar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route index element={<Navigate to="/home" replace />} />
                  <Route path="gallery" element={<Plus2GalleryPage />} />
                  <Route path="scholarship" element={<Plus2Scholarship />} />
                  <Route path="fee-structure" element={<Plus2FeeStructure />} />
                  <Route path="contact" element={<Plus2Contact />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </main>
              <Plus2Footer />
            </div>
          }
        />

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
          <Route path="results" element={<ResultManagement />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="organization" element={<OrganizationManagement />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
