export default function Footer() {
  return (
    <div className="footer-outer-frame">
      <footer className="footer" id="contact">
        <div className="footer-content">
          {/* Brand info */}
          <div className="footer-brand-sec">
            <div className="footer-brand-logo">
              <svg
                className="footer-logo-icon"
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
              <span className="footer-logo-devanagari">अक्षर</span>
            </div>
            <div className="footer-brand-details">
              <h3 className="footer-title">Akshar</h3>
              <p className="footer-subtitle">Akshara marg, Butwal</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-nav-col">
            <ul className="footer-links">
              <li><a href="#faculty">Faculty</a></li>
              <li><a href="#notice">Notice</a></li>
              <li><a href="#it">IT Management</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="footer-contact-col">
            <h4 className="footer-col-heading">Contact Us</h4>
            <p className="footer-contact-item">akshar@gmail.com</p>
            <p className="footer-contact-item">984xxxxxxx</p>
          </div>

          {/* Column 4: Location */}
          <div className="footer-location-col">
            <h4 className="footer-col-heading">Location</h4>
          </div>
        </div>
      </footer>
    </div>
  );
}
