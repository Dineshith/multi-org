import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const location = useLocation();

  const handleMouseEnter = (menu) => {
    setHoveredMenu(menu);
  };

  const handleMouseLeave = () => {
    setHoveredMenu(null);
  };

  // Helper function to keep parent active if a child route is active
  const isDropdownActive = (basePath) => {
    return location.pathname.startsWith(basePath);
  };

  // SVG Arrow Icon Component for reusability
  const DownArrow = () => (
    <svg className="w-3 h-3 ml-1 fill-current opacity-70" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  );

  return (
    <nav className="bg-[#0c1a30] px-12 py-3 flex items-center justify-between w-full relative z-50">
      <Link to="/school" className="flex flex-col items-center justify-center w-24 shrink-0">
        <img src={logo} alt="Akshar Logo" className="w-14 h-auto object-contain" />
        <span className="text-white font-bold text-2xl tracking-wider mt-1">अक्षर</span>
      </Link>
      
      <div className="hidden xl:flex flex-1 justify-center">
        {/* यहाँ items-center थपेर एलाइनमेन्ट मिलाइएको छ */}
        <ul className="flex items-center space-x-10 text-white font-medium text-[16px] tracking-wide">
          
          <li>
            <NavLink 
              to="/school/home" 
              className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
            >
              Home
            </NavLink>
          </li>
          
          {/* About Us Dropdown */}
          <li 
            className="relative py-2" 
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center">
              <NavLink 
                to="/school/about" 
                className={({ isActive }) => `pb-1 transition-colors flex items-center ${isActive || isDropdownActive('/school/faculty-messages') || isDropdownActive('/school/teachers') || isDropdownActive('/school/administrators') ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                About us
                <DownArrow />
              </NavLink>
            </div>
            
            {hoveredMenu === 'about' && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 transition-opacity duration-300">
                <Link to="/school/about" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">About</Link>
                <Link to="/school/faculty-messages" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Messages From Executives</Link>
                <Link to="/school/teachers" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Teachers</Link>
                <Link to="/school/administrators" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Administrators</Link>
              </div>
            )}
          </li>
          
          {/* Resources Dropdown */}
          <li 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center">
              <NavLink 
                to="/school/resources" 
                className={({ isActive }) => `pb-1 transition-colors flex items-center ${isActive || isDropdownActive('/school/gallery') ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Resources
                <DownArrow />
              </NavLink>
            </div>
            {hoveredMenu === 'resources' && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 transition-opacity duration-300">
                <Link to="/school/gallery" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Gallery</Link>
              </div>
            )}
          </li>
          
          {/* Update Dropdown */}
          <li 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('update')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center">
              <NavLink 
                to="/school/update" 
                className={({ isActive }) => `pb-1 transition-colors flex items-center ${isActive || isDropdownActive('/school/events') ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Update
                <DownArrow />
              </NavLink>
            </div>
            {hoveredMenu === 'update' && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 transition-opacity duration-300">
                <Link to="/school/events" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Events</Link>
              </div>
            )}
          </li>
          
          {/* Academic Dropdown */}
          <li 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('academic')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center">
              <NavLink 
                to="/school/academic" 
                className={({ isActive }) => `pb-1 transition-colors flex items-center ${isActive || isDropdownActive('/school/scholarship') ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Academic
                <DownArrow />
              </NavLink>
            </div>
            {hoveredMenu === 'academic' && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50 transition-opacity duration-300">
                <Link to="/school/scholarship" className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Scholarship</Link>
              </div>
            )}
          </li>
          
          {/* Courses Dropdown */}
          <li 
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('courses')}
            onMouseLeave={handleMouseLeave}
          >
             <div className="flex items-center">
              <NavLink 
                to="/school/courses" 
                className={({ isActive }) => `pb-1 transition-colors flex items-center ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Courses
                <DownArrow />
              </NavLink>
            </div>
          </li>
          
          <li>
            <NavLink 
              to="/school/contact" 
              className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
            >
              Contact
            </NavLink>
          </li>
          
        </ul>
      </div>
      
      <div className="hidden xl:block w-24 shrink-0"></div>
    </nav>
  );
};

export default Navbar;