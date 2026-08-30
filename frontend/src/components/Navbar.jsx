import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-[#051087] w-full sticky top-0 z-[100] shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
      <nav className={`w-full flex items-center justify-between py-[0.65rem] px-[clamp(1.25rem,3.5vw,3.5rem)] bg-[#051087] min-h-[64px] ${mobileOpen ? 'mobile-open' : ''}`} id="navbar">
        {/* Brand / Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex flex-col items-center justify-center text-white no-underline cursor-pointer" style={{ textDecoration: 'none' }}>
            {/* Graduation Cap Logo Icon */}
            <svg
              className="w-7 h-7 stroke-white fill-none"
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
            <span className="font-['Mukta',sans-serif] text-base font-bold tracking-[0.5px] -mt-[3px] text-white">अक्षर</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`items-center gap-[clamp(1.2rem,2.5vw,2.5rem)] ${mobileOpen ? 'flex flex-col absolute top-[64px] left-0 right-0 bg-[#051087] py-5 px-8 gap-4 z-50 shadow-[0_10px_20px_rgba(0,0,0,0.3)]' : 'hidden md-nav:flex'}`}>
          <Link to="/home" className={`text-white text-[0.95rem] font-medium no-underline transition-all duration-200 relative py-1 hover:opacity-85 ${location.pathname === '/home' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>Home</Link>
          <Link to="/faculty" className={`text-white text-[0.95rem] font-medium no-underline transition-all duration-200 relative py-1 hover:opacity-85 ${location.pathname === '/faculty' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>Faculty</Link>
          <Link to="/about" className={`text-white text-[0.95rem] font-medium no-underline transition-all duration-200 relative py-1 hover:opacity-85 ${location.pathname === '/about' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>About Us</Link>
        </div>

        {/* Action Buttons */}
        <div className={`items-center gap-[0.6rem] flex-nowrap ${mobileOpen ? 'flex flex-row flex-wrap pt-2 border-t border-white/15' : 'hidden md-nav:flex'}`}>
          <button className="bg-[#d32f2f] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#b71c1c] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] active:translate-y-0" id="btn-admission">
            Primary Wing (+2)
          </button>
          <button className="bg-[#d32f2f] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#b71c1c] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] active:translate-y-0" id="btn-results">
            Results
          </button>
          <button className="bg-[#d32f2f] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#b71c1c] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] active:translate-y-0" id="btn-notice">
            Notice
          </button>
          <Link to="/contact" className="bg-[#d32f2f] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-[#b71c1c] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] active:translate-y-0 no-underline inline-block text-center" id="btn-contact">
            Contact
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5 hidden max-[820px]:flex"
          id="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="w-6 h-[2.5px] bg-white rounded-sm transition-all duration-300"></span>
          <span className="w-6 h-[2.5px] bg-white rounded-sm transition-all duration-300"></span>
          <span className="w-6 h-[2.5px] bg-white rounded-sm transition-all duration-300"></span>
        </button>
      </nav>

      {/* Custom breakpoint style for nav visibility */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 821px) {
          .md-nav\\:flex { display: flex !important; }
        }
      `}} />
    </header>
  );
}
