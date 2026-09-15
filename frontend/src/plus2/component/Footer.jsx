import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <div className="brand-title">
            <span className="logo-icon">🎓</span> 
            <h2>Akshar</h2>
          </div>
          <p>Dallubari-Dharan, Sunsari</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Faculty</h4>
            <a href="#">Science</a>
            <a href="#">IT</a>
            <a href="#">Management</a>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <a href="mailto:akshar@gmail.com">akshar@gmail.com</a>
            <a href="tel:9842106890">9842108890</a>
          </div>
        </div>

        <div className="footer-location">
          <h4>Location</h4>
          <div className="map-placeholder">Map Image</div>
        </div>
        
      </div>
    </footer>
  );
}