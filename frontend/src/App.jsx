
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";

// Existing pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import FacultyPage from "./pages/FacultyPage";
import ContactPage from "./pages/ContactPage";

// +2 pages
import PlusTwoHome from "./pages/plus2page/HomePage";
import PlusTwoAbout from "./pages/plus2page/AboutPage";
import PlusTwoContact from "./pages/plus2page/Contact"

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= MAIN WEBSITE ================= */}

        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/faculty"
          element={<FacultyPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />


        {/* ================= +2 WEBSITE ================= */}

        <Route
          path="/plus2"
          element={<PlusTwoHome />}
        />

        <Route
          path="/plus2/about"
          element={<PlusTwoAbout />}
        />

        <Route
          path="/plus2/contact"
          element={<PlusTwoContact />}
        />

        


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>
    </Router>
  );
}

export default App;
