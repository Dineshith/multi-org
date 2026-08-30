import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-[var(--color-primary)] w-full sticky top-0 z-[100] shadow-[var(--shadow-nav)]">
      <nav className={`w-full flex items-center justify-between py-[0.65rem] px-[clamp(1.25rem,3.5vw,3.5rem)] bg-[var(--color-primary)] min-h-[4rem] ${mobileOpen ? 'mobile-open' : ''}`} id="navbar">
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
            <span className="font-[var(--font-brand)] text-base font-bold tracking-[0.5px] -mt-[0.1875rem] text-white">अक्षर</span>
          </Link>
        </div>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 min-[821px]:hidden top-[4rem]"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Dropdown & Desktop Nav Container */}
        <div className={`
          fixed top-0 right-0 h-[100dvh] h-screen w-[16.25rem] bg-[var(--color-primary)] flex flex-col p-6 pt-[5.5rem] shadow-[var(--shadow-mobile-drawer)] z-[90] transition-transform duration-[var(--transition-base)] ease-in-out overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
          min-[821px]:translate-x-0 min-[821px]:transition-none min-[821px]:w-auto min-[821px]:h-auto min-[821px]:flex min-[821px]:static min-[821px]:flex-row min-[821px]:flex-1 min-[821px]:items-center min-[821px]:justify-between min-[821px]:p-0 min-[821px]:shadow-none min-[821px]:bg-transparent min-[821px]:ml-8 min-[821px]:overflow-visible
        `}>
          {/* Navigation Links */}
          <div className="flex flex-col min-[821px]:flex-row min-[821px]:items-center gap-4 min-[821px]:gap-[clamp(1.2rem,2.5vw,2.5rem)] min-[821px]:mx-auto">
            <Link to="/home" className={`text-white text-[0.95rem] font-medium w-fit no-underline transition-all duration-[var(--transition-fast)] relative py-1 hover:opacity-85 ${location.pathname === '/home' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>Home</Link>
            <Link to="/faculty" className={`text-white text-[0.95rem] font-medium w-fit no-underline transition-all duration-[var(--transition-fast)] relative py-1 hover:opacity-85 ${location.pathname === '/faculty' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>Faculty</Link>
            <Link to="/about" className={`text-white text-[0.95rem] font-medium w-fit no-underline transition-all duration-[var(--transition-fast)] relative py-1 hover:opacity-85 ${location.pathname === '/about' ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-sm' : ''}`}>About Us</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col min-[821px]:flex-row min-[821px]:flex-nowrap items-stretch min-[821px]:items-center gap-[0.6rem] border-t border-white/15 min-[821px]:border-none pt-4 min-[821px]:pt-0 mt-4 min-[821px]:mt-0 w-full min-[821px]:w-auto">
            <button className="bg-[var(--color-accent)] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-accent-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-sm)] active:translate-y-0" id="btn-admission">
              Primary Wing (+2)
            </button>
            <button className="bg-[var(--color-accent)] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-accent-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-sm)] active:translate-y-0" id="btn-results">
              Results
            </button>
            <button className="bg-[var(--color-accent)] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-accent-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-sm)] active:translate-y-0" id="btn-notice">
              Notice
            </button>
            <Link to="/contact" className="bg-[var(--color-accent)] text-white text-[0.78rem] font-semibold py-[0.45rem] px-[0.95rem] rounded border-none cursor-pointer whitespace-nowrap transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-accent-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-sm)] active:translate-y-0 no-underline inline-block text-center" id="btn-contact">
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex-col gap-[0.3125rem] bg-transparent border-none cursor-pointer p-1.5 flex min-[821px]:hidden relative z-[100]"
          id="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`w-6 h-[0.15625rem] bg-white rounded-sm transition-all duration-[var(--transition-base)] origin-center ${mobileOpen ? 'rotate-45 translate-y-[0.46875rem]' : ''}`}></span>
          <span className={`w-6 h-[0.15625rem] bg-white rounded-sm transition-all duration-[var(--transition-base)] ${mobileOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-[0.15625rem] bg-white rounded-sm transition-all duration-[var(--transition-base)] origin-center ${mobileOpen ? '-rotate-45 -translate-y-[0.46875rem]' : ''}`}></span>
        </button>
      </nav>


    </header>
  );
}
