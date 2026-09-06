import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const Navbar = () => {
  return (
    <nav className="bg-[#0c1a30] px-12 py-3 flex items-center justify-between w-full">
      <div className="flex flex-col items-center justify-center w-24 shrink-0">
        <img src={logo} alt="Akshar Logo" className="w-14 h-auto object-contain" />
        <span className="text-white font-bold text-2xl tracking-wider mt-1">अक्षर</span>
      </div>
      
      <div className="hidden xl:flex flex-1 justify-center">
        <ul className="flex space-x-10 text-white font-medium text-[16px] tracking-wide">
          <li className="text-[#da251c] cursor-pointer transition-colors">Home</li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-1">
            About us <span className="text-lg font-semibold leading-none">+</span>
          </li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-1">
            Resources <span className="text-lg font-semibold leading-none">+</span>
          </li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-1">
            Update <span className="text-lg font-semibold leading-none">+</span>
          </li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-1">
            Academic <span className="text-lg font-semibold leading-none">+</span>
          </li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-1">
            Courses <span className="text-lg font-semibold leading-none">+</span>
          </li>
          <li className="cursor-pointer hover:text-gray-300 transition-colors">Contact</li>
        </ul>
      </div>
      
      <div className="hidden xl:block w-24 shrink-0"></div>
    </nav>
  );
};

export default Navbar;