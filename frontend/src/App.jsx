import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';

// Main Project
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResearchPage from './pages/ResearchPage';

// Admin
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import ResultManagement from './admin/pages/ResultManagement';
import AdminGallery from './admin/pages/Gallery';
import AdminLogin from './admin/pages/AdminLogin';

// School
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

// Plus2
import Plus2 from './plus2';
import EventsPage from "./plus2/page/EventsPage";
import ScienceCourse from "./plus2/page/ScienceCourse"; 
import ManagementCourse from "./plus2/page/ManagementCourse"; 

import './school/school.css';

function App() {
  return (
    <div className="w-full max-w-full m-0 p-0 bg-white min-h-screen flex flex-col">
      <Routes>

        {/* ================= MAIN PROJECT ================= */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/research" element={<ResearchPage />} />

        {/* ================= PLUS2 ================= */}
        <Route path="/plus2" element={<Plus2 />} />
        <Route path="/plus2/events" element={<EventsPage />} />
        <Route path="/plus2/science" element={<ScienceCourse />} />
        <Route path="/plus2/management" element={<ManagementCourse />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="results" element={<ResultManagement />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* ================= SCHOOL ================= */}
        <Route path="/school/*" element={
          <div className="school-font text-gray-900 bg-white w-full">
            <SchoolNavbar />
            <Routes>
              <Route path="/" element={<Navigate to="home" replace />} />
              <Route path="home" element={<SchoolHome />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<SchoolContact />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="faculty-messages" element={<FacultyMessages />} />
              <Route path="administration" element={<Administrators />} />
              <Route path="gallery" element={<SchoolGallery />} />
              <Route path="gallery/:id" element={<GalleryDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="scholarship" element={<Scholarship />} />
            </Routes>
          </div>
        } />

      </Routes>
    </div>
  );
}

export default App;