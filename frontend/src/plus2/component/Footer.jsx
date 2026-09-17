import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0c1a30] text-white pt-16 pb-8 px-6 md:px-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Column 1: Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/logo.png" 
              alt="Akshar Logo" 
              className="h-12 w-auto object-contain brightness-0 invert" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
              }} 
            />
            <span className="font-extrabold text-2xl tracking-wider font-sans text-white leading-none">
              अक्षर
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">Akshar Higher Secondary School</h3>
          <p className="text-xs text-gray-400 mb-3">Plus Two (+2) Wing, Itahari</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Delivering 28+ years of academic excellence in Science, Management, and Computer Science with distinguished NEB results and top university placements.
          </p>
        </div>

        {/* Column 2: Programs & Links */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Plus Two Programs
          </h4>
          <ul className="text-xs text-gray-300 space-y-2.5 font-medium">
            <li>
              <Link to="/plus2" className="hover:text-white transition no-underline text-gray-300">
                +2 Science (Medical & Engineering)
              </Link>
            </li>
            <li>
              <Link to="/plus2" className="hover:text-white transition no-underline text-gray-300">
                +2 Management & Business Studies
              </Link>
            </li>
            <li>
              <Link to="/plus2" className="hover:text-white transition no-underline text-gray-300">
                +2 Computer Science & IT
              </Link>
            </li>
            <li>
              <Link to="/plus2/scholarship" className="hover:text-white transition no-underline text-gray-300">
                Scholarship Criteria 2026/27
              </Link>
            </li>
            <li>
              <Link to="/plus2/fee-structure" className="hover:text-white transition no-underline text-gray-300">
                Fee Structure Breakdown
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Navigation */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="text-xs text-gray-300 space-y-2.5 font-medium">
            <li>
              <Link to="/plus2/about" className="hover:text-white transition no-underline text-gray-300">
                About Us & History
              </Link>
            </li>
            <li>
              <Link to="/plus2/faculty" className="hover:text-white transition no-underline text-gray-300">
                Faculty Members
              </Link>
            </li>
            <li>
              <Link to="/plus2/gallery" className="hover:text-white transition no-underline text-gray-300">
                Campus Photo Gallery
              </Link>
            </li>
            <li>
              <Link to="/plus2/contact" className="hover:text-white transition no-underline text-gray-300">
                Admission Inquiry & FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Location */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Campus Desk
          </h4>
          <ul className="text-xs text-gray-300 space-y-3 font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>Aaitabare, Itahari-4, Sunsari, Nepal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <span>+977 025-581234 / 9842108899</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <span>plustwo@akshar.edu.np</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <span>Sun - Fri: 6:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div>
          © {new Date().getFullYear()} Akshar Higher Secondary School (+2). All Rights Reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link to="/school" className="hover:text-white transition no-underline text-gray-400">School Wing</Link>
          <Link to="/plus2" className="hover:text-white transition text-red-400 font-bold no-underline">PlusTwo Wing</Link>
          <Link to="/bachelor" className="hover:text-white transition no-underline text-gray-400">Bachelors Wing</Link>
        </div>
      </div>
    </footer>
  );
}