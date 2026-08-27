import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className={`navbar ${mobileOpen ? 'mobile-open' : ''}`} id="navbar">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="logo-container">
            {/* Graduation Cap Logo Icon */}
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="logo-devanagari">अक्षर</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#faculty" className="nav-link">Faculty</a>
          <a href="#about" className="nav-link">About Us</a>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button className="nav-pill-btn" id="btn-admission">
            Primary Wing (+2)
          </button>
          <button className="nav-pill-btn" id="btn-results">
            Results
          </button>
          <button className="nav-pill-btn" id="btn-notice">
            Notice
          </button>
          <button className="nav-pill-btn" id="btn-contact">
            Contact
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggle"
          id="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
