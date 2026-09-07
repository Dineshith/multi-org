import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Existing Project Imports
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

//school
import SchoolNavbar from './school/components/Navbar';
import SchoolHome from './school/pages/Home';
import AboutUs from './school/pages/AboutUs';
import SchoolContact from './school/components/Contact';

//Teachers
import Teachers from './school/pages/Teachers';
import FacultyMessages from './school/pages/FacultyMessages';

import './school/school.css';

function App() {
  return (
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
                <Route path="/" element={<SchoolHome />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<SchoolContact />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/faculty-messages" element={<FacultyMessages />} />
              </Routes>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;