import { Navigate, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import FacultyPage from './pages/FacultyPage';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import StudentManagement from './admin/pages/StudentManagement';
import NoticeManagement from './admin/pages/NoticeManagement';
import ResultManagement from './admin/pages/ResultManagement';
import Gallery from './admin/pages/Gallery';
import AdminLogin from './admin/pages/AdminLogin';
import SubjectSetup from './admin/pages/results/SubjectSetup';
import MarksEntry from './admin/pages/results/MarksEntry';
import ViewLedger from './admin/pages/results/ViewLedger';
import PublishResult from './admin/pages/results/PublishResult';
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

        {/* Admin Login Route */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

        {/* Admin Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="results" element={<ResultManagement />}>
            <Route index element={<Navigate to="entry" replace />} />
            <Route path="entry" element={<MarksEntry />} />
            <Route path="ledger" element={<ViewLedger />} />
            <Route path="setup" element={<SubjectSetup />} />
            <Route path="publish" element={<PublishResult />} />
          </Route>
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

