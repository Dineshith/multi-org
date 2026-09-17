import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMouseEnter = (menu) => {
    setHoveredMenu(menu);
  };

  const handleMouseLeave = () => {
    setHoveredMenu(null);
  };

  const DownArrow = () => (
    <svg className="w-3 h-3 ml-1 fill-current opacity-70" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0c1a30] shadow-md w-full">
      <nav className="px-6 md:px-12 py-3 flex items-center justify-between w-full relative">
        {/* Brand / Logo */}
        <Link to="/bachelor" className="flex items-center gap-3 shrink-0 no-underline text-white">
          <img src={logo} alt="Akshar Logo" className="w-11 h-auto object-contain" />
          <span className="text-white font-bold text-2xl tracking-wider">अक्षर</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden min-[960px]:flex flex-1 justify-center">
          <div className="flex items-center space-x-10 text-white font-medium text-[16px] tracking-wide">
          <NavLink
            to="/bachelor"
            end
            className={({ isActive }) =>
              `pb-1 transition-colors flex items-center ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`
            }
          >
            Home
          </NavLink>

          {/* About us dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center pb-1 transition-colors text-white hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 font-medium text-[16px] tracking-wide">
              About us
              <DownArrow />
            </button>
            {hoveredMenu === 'about' && (
              <div className="absolute top-full left-0 mt-0 w-60 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 text-gray-800">
                <a href="#about" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">About Akshar</a>
                <a href="#notices" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Leadership & Message</a>
                <a href="#testimonials" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Testimonials</a>
              </div>
            )}
          </div>

          {/* Academics / Resources dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center pb-1 transition-colors text-white hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 font-medium text-[16px] tracking-wide">
              Academics
              <DownArrow />
            </button>
            {hoveredMenu === 'academics' && (
              <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 text-gray-800">
                <a href="#faculties" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Programs Offered</a>
                <a href="#notices" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Academic Calendar</a>
                <a href="#notices" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Scholarships</a>
              </div>
            )}
          </div>

          {/* Courses / Faculties */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('courses')}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#faculties" className="flex items-center pb-1 transition-colors text-white hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 font-medium text-[16px] tracking-wide">
              Courses
              <DownArrow />
            </a>
            {hoveredMenu === 'courses' && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 text-gray-800">
                <a href="#faculties" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">BCA (Computer Application)</a>
                <a href="#faculties" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">BBS (Business Studies)</a>
                <a href="#faculties" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">BSW (Social Work)</a>
              </div>
            )}
          </div>

          {/* Update */}
          <a href="#news" className="pb-1 transition-colors text-white hover:text-gray-300">
            Update
          </a>

          {/* Contact */}
          <a href="#contact" className="pb-1 transition-colors text-white hover:text-gray-300">
            Contact
          </a>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-[960px]:hidden text-white p-2 focus:outline-none"
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
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="min-[960px]:hidden bg-[#0c1a30] border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-white">
          <Link
            to="/bachelor"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium text-[#da251c]"
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium hover:text-gray-300"
          >
            About us
          </a>
          <a
            href="#faculties"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium hover:text-gray-300"
          >
            Courses & Programs
          </a>
          <a
            href="#notices"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium hover:text-gray-300"
          >
            Notices & Events
          </a>
          <a
            href="#news"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium hover:text-gray-300"
          >
            News & Updates
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="py-1.5 text-base font-medium hover:text-gray-300"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
