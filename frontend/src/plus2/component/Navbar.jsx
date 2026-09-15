import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#112445] text-white px-10 py-4 min-h-[100px] flex items-center shadow-md relative z-50">
      
      
      <div className="flex-shrink-0 flex flex-col items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain brightness-0 invert" 
        />
        <span className="font-extrabold text-[32px] tracking-wide font-sans text-white mt-1 leading-none">
          अक्षर
        </span>
      </div>

      <div className="flex-1 hidden md:flex items-center justify-center gap-10 font-semibold text-[15px]">
        
        <Link to="/" className="text-red-500 hover:text-red-400 transition-colors py-2">
          Home
        </Link>
        
        <Link to="/about" className="hover:text-gray-300 transition-colors py-2">
          About us +
        </Link>
        
        <div className="relative group py-2">
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-1 focus:outline-none">
            Resources +
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50 border border-gray-200">
            <Link to="/plus2/gallery" className="block px-4 py-3 hover:bg-gray-100 transition-colors">
              Gallery
            </Link>
          </div>
        </div>

        <Link to="/update" className="hover:text-gray-300 transition-colors py-2">
          Update +
        </Link>

        
        <div className="relative group py-2">
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-1 focus:outline-none">
            Academic +
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50 border border-gray-200">
            <Link to="/plus2/scholarship" className="block px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100">
              Scholarship
            </Link>
            <Link to="/plus2/fee-structure" className="block px-4 py-3 hover:bg-gray-100 transition-colors">
              Fee Structure
            </Link>
          </div>
        </div>

        <Link to="/courses" className="hover:text-gray-300 transition-colors py-2">
          Courses +
        </Link>
        
        <Link to="/plus2/contact" className="hover:text-gray-300 transition-colors py-2">
          Contact
        </Link>
      </div>

    
      <div className="hidden md:block w-[120px]"></div>

    </nav>
  );
}