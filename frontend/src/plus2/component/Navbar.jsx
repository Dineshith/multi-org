import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-[#112445] text-white px-6 md:px-10 py-3.5 min-h-[85px] flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Brand / Logo */}
      <Link to="/plus2" className="flex-shrink-0 flex items-center gap-3 no-underline text-white">
        <img 
          src="/logo.png" 
          alt="Akshar Logo" 
          className="h-12 w-auto object-contain brightness-0 invert" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-[26px] tracking-wide font-sans text-white leading-none">
            अक्षर
          </span>
          <span className="text-[10px] tracking-widest text-red-400 uppercase font-bold mt-0.5">
            Plus Two (+2) Wing
          </span>
        </div>
      </Link>

      {/* Desktop Menu Links */}
      <div className="hidden lg:flex items-center justify-center gap-7 font-semibold text-[15px]">
        <NavLink 
          to="/plus2" 
          end
          className={({ isActive }) => 
            `py-2 transition-colors no-underline ${isActive ? 'text-red-400 border-b-2 border-red-400' : 'text-white hover:text-red-400'}`
          }
        >
          Home
        </NavLink>
        
        <NavLink 
          to="/plus2/about" 
          className={({ isActive }) => 
            `py-2 transition-colors no-underline ${isActive ? 'text-red-400 border-b-2 border-red-400' : 'text-white hover:text-red-400'}`
          }
        >
          About us
        </NavLink>
        
        <NavLink 
          to="/plus2/faculty" 
          className={({ isActive }) => 
            `py-2 transition-colors no-underline ${isActive ? 'text-red-400 border-b-2 border-red-400' : 'text-white hover:text-red-400'}`
          }
        >
          Faculty
        </NavLink>

        {/* Academic Dropdown */}
        <div className="relative group py-2">
          <button className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer py-1 focus:outline-none bg-transparent border-none text-white font-semibold text-[15px]">
            Academics
            <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50 border border-gray-100">
            <Link to="/plus2/scholarship" className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors border-b border-gray-100 no-underline text-gray-800">
              Scholarship
            </Link>
            <Link to="/plus2/fee-structure" className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors no-underline text-gray-800">
              Fee Structure
            </Link>
          </div>
        </div>

        <NavLink 
          to="/plus2/gallery" 
          className={({ isActive }) => 
            `py-2 transition-colors no-underline ${isActive ? 'text-red-400 border-b-2 border-red-400' : 'text-white hover:text-red-400'}`
          }
        >
          Gallery
        </NavLink>
        
        <NavLink 
          to="/plus2/contact" 
          className={({ isActive }) => 
            `py-2 transition-colors no-underline ${isActive ? 'text-red-400 border-b-2 border-red-400' : 'text-white hover:text-red-400'}`
          }
        >
          Contact
        </NavLink>
      </div>


      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden text-white p-2 focus:outline-none bg-transparent border-none cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#112445] border-t border-white/10 px-6 py-5 flex flex-col gap-3.5 text-white shadow-xl">
          <Link
            to="/plus2"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-semibold text-red-400 no-underline"
          >
            Home
          </Link>
          <Link
            to="/plus2/about"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            About us
          </Link>
          <Link
            to="/plus2/faculty"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            Faculty
          </Link>
          <Link
            to="/plus2/scholarship"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            Scholarship
          </Link>
          <Link
            to="/plus2/fee-structure"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            Fee Structure
          </Link>
          <Link
            to="/plus2/gallery"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            Gallery
          </Link>
          <Link
            to="/plus2/contact"
            onClick={() => setMobileOpen(false)}
            className="py-1 text-base font-medium hover:text-red-400 transition-colors no-underline text-white"
          >
            Contact
          </Link>

        </div>
      )}
    </nav>
  );
}