import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#020510] to-[#0A1B3F] text-white py-12 px-8 md:px-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
      
        <div>
          <div className="flex flex-col items-start mb-3">
            <img 
              src="/logo.png" 
              alt="Akshar Logo" 
              className="h-14 w-auto object-contain brightness-0 invert mb-2" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
              }} 
            />
            <span className="font-extrabold text-2xl tracking-wider font-sans text-white leading-none">
              अक्षर
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-2">Aaitabare-Itahari, Sunsari</p>
        </div>

      
        <div>
          <h4 className="font-semibold text-white mb-4 text-base">Faculty</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Science</li>
            <li>IT</li>
            <li>Management</li>
          </ul>
        </div>

    
        <div>
          <h4 className="font-semibold text-white mb-4 text-base">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Akshar@gmail.com</li>
            <li>9842108899</li>
          </ul>
        </div>

     
        <div>
          <h4 className="font-semibold text-white mb-4 text-base">Location</h4>
          
        </div>

      </div>
    </footer>
  );
}