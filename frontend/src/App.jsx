import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';

// Existing Project Imports
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResearchPage from './pages/ResearchPage';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import ResultManagement from './admin/pages/ResultManagement';
import Gallery from './admin/pages/Gallery';
import AdminLogin from './admin/pages/AdminLogin';

//school
import SchoolNavbar from './school/components/Navbar';
import SchoolHome from './school/pages/Home';
import AboutUs from './school/pages/AboutUs';
import SchoolContact from './school/components/Contact';

//Teachers
import Teachers from './school/pages/Teachers';
import FacultyMessages from './school/pages/FacultyMessages';

//About Us-Administration
import Administrators from './school/pages/Administrators';

//Resources-Gallery
import Gallery from './school/pages/Gallery';
import GalleryDetail from './school/pages/GalleryDetail';

//Update-Events
import Events from './school/pages/Events';

//Academic-Scholarship
import Scholarship from './school/pages/Scholarship';

import './school/school.css';

function App() {
  return (
suman-branch
    <Router>
      <div className="w-full max-w-full m-0 p-0 bg-white min-h-screen flex flex-col">
        <Routes>
          {/* Main Project Routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* School Project Routes */}
          <Route path="/school/*" element={
            <div className="school-font text-gray-900 bg-white w-full">
              <SchoolNavbar />
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="/home" element={<SchoolHome />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<SchoolContact />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/faculty-messages" element={<FacultyMessages />} />
                <Route path="/administration" element={<Administrators />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:id" element={<GalleryDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/scholarship" element={<Scholarship />} />
              </Routes>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

    <div className="w-full max-w-full m-0 p-0 bg-white min-h-screen flex flex-col">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/research" element={<ResearchPage />} />

        {/* Admin Login Route */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

        {/* Admin Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="results" element={<ResultManagement />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

main
