import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Eye, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {/* Banner */}
      <div 
        className="w-full h-72 md:h-80 bg-cover bg-center relative flex items-center px-8 md:px-20"
        style={{
          backgroundImage: `linear-gradient(rgba(12, 26, 48, 0.75), rgba(12, 26, 48, 0.9)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200')`
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <div className="w-12 h-1.5 bg-red-600 mb-3"></div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md">
            About Akshar Plus Two (+2)
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            28+ years of shaping medical, engineering, and management leaders in Eastern Nepal.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-16 px-6 md:px-12 space-y-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Our Heritage</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-6 leading-snug">
              Excellence in Higher Secondary Education
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
              Akshar Higher Secondary School (+2 Wing) has been recognized as a benchmark institution affiliated with the National Examination Board (NEB), Nepal. We provide comprehensive educational programs in Science, Management, and Computer Science.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
              Our campus in Itahari fosters intellectual curiosity, leadership qualities, and critical thinking skills essential for higher university degrees both nationally and internationally.
            </p>
            <div className="flex gap-4">
              <Link
                to="/plus2/scholarship"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg text-sm transition-all no-underline shadow"
              >
                Scholarships
              </Link>
              <Link
                to="/plus2/contact"
                className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold px-6 py-3 rounded-lg text-sm transition-all no-underline"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
              alt="Akshar Students"
              className="rounded-2xl shadow-xl w-full object-cover h-[380px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-6 rounded-xl shadow-lg hidden sm:block">
              <div className="text-3xl font-black">28+</div>
              <div className="text-xs uppercase font-semibold">Years of Academic Glory</div>
            </div>
          </div>
        </div>

        {/* Mission / Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To be the premier center for higher secondary education in Nepal, producing responsible citizens, innovative thinkers, and compassionate global leaders who excel academically and socially.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To impart quality education with high moral standards, state-of-the-art laboratory facilities, interactive teaching methodologies, and dedicated competitive entrance preparation for every aspiring student.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
