import React from 'react';
import logo from '../../assets/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#0c1a30] text-white py-16 px-8 md:px-24 mt-12 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Akshar Logo" className="w-12 h-auto object-contain" />
            <span className="font-bold text-3xl tracking-wider">अक्षर</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Akshar</h3>
          <p className="text-xs text-gray-300">Aaitabare-Itahari, Sunsari</p>
        </div>

        {/* Faculty */}
        <div>
          <h4 className="font-bold text-sm mb-6">Faculty</h4>
          <ul className="text-xs text-gray-300 space-y-3 font-medium">
            <li className="cursor-pointer hover:text-white transition">Science</li>
            <li className="cursor-pointer hover:text-white transition">IT</li>
            <li className="cursor-pointer hover:text-white transition">Management</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-bold text-sm mb-6">Contact Us</h4>
          <ul className="text-xs text-gray-300 space-y-3 font-medium">
            <li>akshar@gmail.com</li>
            <li>9842108899</li>
          </ul>
        </div>

        {/* Location Map */}
        <div>
          <h4 className="font-bold text-sm mb-6">Location</h4>
          {/* <img 
            // src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" 
            // alt="Map location placeholder" 
            className="w-full h-24 object-cover rounded-sm opacity-90 hover:opacity-100 transition cursor-pointer"
          /> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;