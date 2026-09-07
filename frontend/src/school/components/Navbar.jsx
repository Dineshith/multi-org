import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu, e) => {
    e.preventDefault();
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => setOpenMenu(null);

  return (
    <nav className="bg-[#0c1a30] px-12 py-3 flex items-center justify-between w-full relative z-50">
      <Link to="/school" onClick={closeMenu} className="flex flex-col items-center justify-center w-24 shrink-0">
        <img src={logo} alt="Akshar Logo" className="w-14 h-auto object-contain" />
        <span className="text-white font-bold text-2xl tracking-wider mt-1">अक्षर</span>
      </Link>
      
      <div className="hidden xl:flex flex-1 justify-center">
        <ul className="flex space-x-10 text-white font-medium text-[16px] tracking-wide">
          
          <li>
            <NavLink 
              to="/school" 
              end
              onClick={closeMenu}
              className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
            >
              Home
            </NavLink>
          </li>
          
          {/* About Us Dropdown */}
          <li className="relative">
            <div className="flex items-center gap-1">
              <NavLink 
                to="/school/about" 
                className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                About us
              </NavLink>
              <button onClick={(e) => toggleMenu('about', e)} className="text-lg font-semibold leading-none pb-1 hover:text-gray-300 focus:outline-none">
                {openMenu === 'about' ? '-' : '+'}
              </button>
            </div>
            {openMenu === 'about' && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50">
                <Link to="/school/about" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">About</Link>
                {/* यहाँ Messages From Executives थपिएको छ */}
                <Link to="/school/faculty-messages" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Messages From Executives</Link>
                <Link to="/school/teachers" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Teachers</Link>
                <Link to="/school/administration" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Administration</Link>
              </div>
            )}
          </li>
          
          {/* Resources Dropdown */}
          <li className="relative">
            <div className="flex items-center gap-1">
              <NavLink 
                to="/school/resources" 
                className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Resources
              </NavLink>
              <button onClick={(e) => toggleMenu('resources', e)} className="text-lg font-semibold leading-none pb-1 hover:text-gray-300 focus:outline-none">
                {openMenu === 'resources' ? '-' : '+'}
              </button>
            </div>
            {openMenu === 'resources' && (
              <div className="absolute top-full left-0 mt-3 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50">
                <Link to="/school/gallery" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Gallery</Link>
              </div>
            )}
          </li>
          
          <li>
            <NavLink 
              to="/school/update" 
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center gap-1 pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
            >
              Update <span className="text-lg font-semibold leading-none">+</span>
            </NavLink>
          </li>
          
          {/* Academic Dropdown */}
          <li className="relative">
            <div className="flex items-center gap-1">
              <NavLink 
                to="/school/academic" 
                className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
              >
                Academic
              </NavLink>
              <button onClick={(e) => toggleMenu('academic', e)} className="text-lg font-semibold leading-none pb-1 hover:text-gray-300 focus:outline-none">
                {openMenu === 'academic' ? '-' : '+'}
              </button>
            </div>
            {openMenu === 'academic' && (
              <div className="absolute top-full left-0 mt-3 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50">
                <Link to="/school/scholarship" onClick={closeMenu} className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-slate-100 hover:text-[#da251c] transition-colors">Scholarship</Link>
              </div>
            )}
          </li>
          
          <li>
            <NavLink 
              to="/school/courses" 
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center gap-1 pb-1 transition-colors ${isActive ? 'text-[#da251c] border-b-2 border-[#da251c]' : 'hover:text-gray-300'}`}
            >
              Courses <span className="text-lg font-semibold leading-none">+</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/school/contact" 
              onClick={closeMenu}
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