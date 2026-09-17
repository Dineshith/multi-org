import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#0c1a30] text-white pt-16 pb-8 px-6 md:px-16 w-full border-t border-white/10" id="contact">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Column 1: Logo & Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="Akshar Logo" className="w-12 h-auto object-contain" />
            <span className="font-bold text-3xl tracking-wider">अक्षर</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Akshar College</h3>
          <p className="text-xs text-gray-400 mb-3">Vishwa Adarsha Campus, Itahari</p>
          <p className="text-xs text-gray-300 leading-relaxed max-w-xs">
            A center of higher education excellence empowering leaders in IT, Business Management, and Social Sciences with 28+ years of academic distinction.
          </p>
        </div>

        {/* Column 2: Faculty & Programs */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Programs Offered
          </h4>
          <ul className="text-xs text-gray-300 space-y-3 font-medium">
            <li>
              <a href="#faculties" className="hover:text-white hover:underline transition">
                BCA (Computer Application)
              </a>
            </li>
            <li>
              <a href="#faculties" className="hover:text-white hover:underline transition">
                BBS (Business Studies)
              </a>
            </li>
            <li>
              <a href="#faculties" className="hover:text-white hover:underline transition">
                BSW (Social Work)
              </a>
            </li>
            <li>
              <a href="#notices" className="hover:text-white hover:underline transition">
                Academic Calendar 2026
              </a>
            </li>
            <li>
              <a href="#notices" className="hover:text-white hover:underline transition">
                Scholarship Information
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="text-xs text-gray-300 space-y-3 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#da251c] font-bold">📍</span>
              <span>Aaitabare, Itahari-4, Sunsari, Nepal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#da251c] font-bold">📞</span>
              <span>+977 025-581234 / 9842108899</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#da251c] font-bold">✉️</span>
              <span>info@aksharcollege.edu.np</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#da251c] font-bold">⏰</span>
              <span>Sun - Fri: 6:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Location Map */}
        <div>
          <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">
            Location Map
          </h4>
          <div className="w-full h-36 rounded overflow-hidden shadow-sm border border-white/10 bg-slate-800 relative">
            <iframe
              title="College Location Map"
              src="https://maps.google.com/maps?q=Itahari+Nepal&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter grayscale-[20%] contrast-[110%]"
              loading="lazy"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Prime location easily accessible via Koshi Highway, Itahari.
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div>
          © {new Date().getFullYear()} Akshar / Vishwa Adarsha College. All Rights Reserved.
        </div>
        <div className="flex gap-6">
          <Link to="/school" className="hover:text-white transition">School Wing</Link>
          <Link to="/plus2" className="hover:text-white transition">PlusTwo Wing</Link>
          <Link to="/bachelor" className="hover:text-white transition text-[#da251c] font-bold">Bachelors Wing</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
