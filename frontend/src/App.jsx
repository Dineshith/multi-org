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
import Plus2Home from './plus2/pages/Home';
import Plus2About from './plus2/pages/About';
import Plus2Faculty from './plus2/pages/Faculty';
import Plus2GalleryPage from './plus2/pages/GalleryPage';
import Plus2Scholarship from './plus2/pages/Scholarship';
import Plus2FeeStructure from './plus2/pages/FeeStructure';
import Plus2Contact from './plus2/pages/Contact';


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
import InstutiteDetails from './admin/pages/results/InstutiteDetails';
import AdminLogin from './admin/pages/AdminLogin';
import CMSManagement from './admin/pages/cms/CMSManagement';
import Contact from './admin/pages/Contact';

// CMS Imports
import MainPortalHomeHero from './admin/pages/cms/mainportal/home/Hero';
import MainPortalHomeGallery from './admin/pages/cms/mainportal/home/Gallery';
import MainPortalResearchHero from './admin/pages/cms/mainportal/research/Hero';
import MainPortalAcademicLeadership from './admin/pages/cms/mainportal/faculty/AcademicLeadership';
import MainPortalFooter from './admin/pages/cms/mainportal/Footer';
import MainPortalNavbar from './admin/pages/cms/mainportal/Navbar';
import OrganizationManagement from './admin/pages/OrganizationManagement';

// School CMS Imports
import CMSSchoolHomeHero from './admin/pages/cms/school/home/Hero';
import CMSSchoolHomeNotice from './admin/pages/cms/school/home/NoticeBoard';
import CMSSchoolHomeOffer from './admin/pages/cms/school/home/WhatWeOffer';
import CMSSchoolAboutHero from './admin/pages/cms/school/about/Hero';
import CMSSchoolAboutContent from './admin/pages/cms/school/about/AboutContent';
import CMSSchoolFacultyMessagesHero from './admin/pages/cms/school/facultymessages/Hero';
import CMSSchoolFacultyMessagesList from './admin/pages/cms/school/facultymessages/FacultyMessagesList';
import CMSSchoolTeachersHero from './admin/pages/cms/school/teachers/Hero';
import CMSSchoolTeachersList from './admin/pages/cms/school/teachers/TeachersList';
import CMSSchoolAdministratorsHero from './admin/pages/cms/school/administrators/Hero';
import CMSSchoolAdministratorsList from './admin/pages/cms/school/administrators/AdministratorsList';
import CMSSchoolEventsHero from './admin/pages/cms/school/events/Hero';
import CMSSchoolEventsList from './admin/pages/cms/school/events/EventsList';
import CMSSchoolGalleryHero from './admin/pages/cms/school/gallery/Hero';
import CMSSchoolGalleryGrid from './admin/pages/cms/school/gallery/GalleryGrid';
import CMSSchoolScholarshipHero from './admin/pages/cms/school/scholarship/Hero';
import CMSSchoolScholarshipList from './admin/pages/cms/school/scholarship/ScholarshipList';
import CMSSchoolNavbar from './admin/pages/cms/school/Navbar';
import CMSSchoolFooter from './admin/pages/cms/school/Footer';

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
                  <Route index element={<Plus2Home />} />
                  <Route path="home" element={<Navigate to="/plus2" replace />} />
                  <Route path="about" element={<Plus2About />} />
                  <Route path="faculty" element={<Plus2Faculty />} />
                  <Route path="scholarship" element={<Plus2Scholarship />} />
                  <Route path="fee-structure" element={<Plus2FeeStructure />} />
                  <Route path="gallery" element={<Plus2GalleryPage />} />
                  <Route path="contact" element={<Plus2Contact />} />
                  <Route path="*" element={<Navigate to="/plus2" replace />} />
                </Routes>
              </main>
              <Plus2Footer />
            </div>
          }
        />
        <Route path="/plustwo" element={<Navigate to="/plus2" replace />} />
        <Route path="/plustwo/*" element={<Navigate to="/plus2" replace />} />


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
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

        {/* Admin Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="notice" element={<NoticeManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="contact" element={<Contact />} />
          <Route path="organization" element={<OrganizationManagement />} />
          <Route path="results" element={<ResultManagement />}>
            <Route index element={<Navigate to="institute-details" replace />} />
            <Route path="institute-details" element={<InstutiteDetails />} />
            <Route path="setup" element={<SubjectSetup />} />
            <Route path="entry" element={<MarksEntry />} />
            <Route path="ledger" element={<ViewLedger />} />
            <Route path="publish" element={<PublishResult />} />
          </Route>
          <Route path="cms" element={<CMSManagement />}>
            <Route index element={<Navigate to="main-hero" replace />} />
            <Route path="main-hero" element={<MainPortalHomeHero />} />
            <Route path="main-gallery" element={<MainPortalHomeGallery />} />
            <Route path="research-hero" element={<MainPortalResearchHero />} />
            <Route path="faculty-leadership" element={<MainPortalAcademicLeadership />} />
            <Route path="footer" element={<MainPortalFooter />} />
            <Route path="navbar" element={<MainPortalNavbar />} />

            {/* School CMS Routes */}
            <Route path="school-hero" element={<CMSSchoolHomeHero />} />
            <Route path="school-notice" element={<CMSSchoolHomeNotice />} />
            <Route path="school-offer" element={<CMSSchoolHomeOffer />} />
            <Route path="school-about-hero" element={<CMSSchoolAboutHero />} />
            <Route path="school-about-content" element={<CMSSchoolAboutContent />} />
            <Route path="school-messages-hero" element={<CMSSchoolFacultyMessagesHero />} />
            <Route path="school-messages-list" element={<CMSSchoolFacultyMessagesList />} />
            <Route path="school-teachers-hero" element={<CMSSchoolTeachersHero />} />
            <Route path="school-teachers-list" element={<CMSSchoolTeachersList />} />
            <Route path="school-admins-hero" element={<CMSSchoolAdministratorsHero />} />
            <Route path="school-admins-list" element={<CMSSchoolAdministratorsList />} />
            <Route path="school-events-hero" element={<CMSSchoolEventsHero />} />
            <Route path="school-events-list" element={<CMSSchoolEventsList />} />
            <Route path="school-gallery-hero" element={<CMSSchoolGalleryHero />} />
            <Route path="school-gallery-grid" element={<CMSSchoolGalleryGrid />} />
            <Route path="school-scholarship-hero" element={<CMSSchoolScholarshipHero />} />
            <Route path="school-scholarship-list" element={<CMSSchoolScholarshipList />} />
            <Route path="school-navbar" element={<CMSSchoolNavbar />} />
            <Route path="school-footer" element={<CMSSchoolFooter />} />
          </Route>
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
