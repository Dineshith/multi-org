import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, BookOpen, Users, ArrowRight, ChevronDown } from 'lucide-react';

const programs = [
  {
    id: 'bca',
    name: 'Bachelor of Computer Applications',
    short: 'BCA',
    duration: '4 Years / 8 Semesters',
    seats: 72,
    affiliation: 'Tribhuvan University',
    color: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-100 text-blue-700',
    description:
      'BCA is a four-year undergraduate program focused on computer applications, programming, networking, and database management. Ideal for students passionate about IT and software development.',
    subjects: ['Programming in C', 'Data Structures', 'Database Management', 'Web Technology', 'Software Engineering', 'Computer Networks'],
    eligibility: 'Passed 10+2 or equivalent with at least 45% marks.',
  },
  {
    id: 'csit',
    name: 'BSc. Computer Science & IT',
    short: 'CSIT',
    duration: '4 Years / 8 Semesters',
    seats: 48,
    affiliation: 'Tribhuvan University',
    color: 'from-violet-500 to-purple-700',
    badge: 'bg-violet-100 text-violet-700',
    description:
      'CSIT is a science-oriented program combining computer science theory with modern IT practices. It covers algorithms, machine learning, AI, and advanced programming concepts.',
    subjects: ['Discrete Mathematics', 'Object-Oriented Programming', 'Artificial Intelligence', 'Machine Learning', 'Computer Architecture', 'Compiler Design'],
    eligibility: 'Passed 10+2 in Science stream with at least 45% marks.',
  },
  {
    id: 'bbs',
    name: 'Bachelor of Business Studies',
    short: 'BBS',
    duration: '4 Years (Annual)',
    seats: 96,
    affiliation: 'Tribhuvan University',
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700',
    description:
      'BBS is a management program that provides foundational knowledge in accounting, finance, marketing, and business management for aspiring entrepreneurs and corporate professionals.',
    subjects: ['Business Mathematics', 'Accountancy', 'Marketing', 'Business Economics', 'Business Law', 'Entrepreneurship'],
    eligibility: 'Passed 10+2 or equivalent from any stream.',
  },
  {
    id: 'bit',
    name: 'Bachelor of Information Technology',
    short: 'BIT',
    duration: '4 Years / 8 Semesters',
    seats: 48,
    affiliation: 'Tribhuvan University',
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-100 text-emerald-700',
    description:
      'BIT combines theory and practice in information technology, covering system analysis, network infrastructure, cybersecurity, and enterprise software development.',
    subjects: ['IT Infrastructure', 'Cybersecurity', 'System Analysis', 'Cloud Computing', 'Mobile Application Development', 'Project Management'],
    eligibility: 'Passed 10+2 or equivalent with at least 45% marks.',
  },
  {
    id: 'bsc',
    name: 'Bachelor of Science',
    short: 'BSc',
    duration: '4 Years (Annual)',
    seats: 60,
    affiliation: 'Tribhuvan University',
    color: 'from-rose-500 to-pink-600',
    badge: 'bg-rose-100 text-rose-700',
    description:
      'BSc is a comprehensive science undergraduate program offering majors in Physics, Mathematics, Statistics, and related disciplines. Suitable for students aiming for research and academia.',
    subjects: ['Mathematics', 'Physics', 'Statistics', 'Chemistry', 'Computer Science', 'Research Methodology'],
    eligibility: 'Passed 10+2 in Science stream with Physics and Mathematics.',
  },
];

function ProgramCard({ program }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{program.affiliation}</span>
            <h3 className="text-xl font-extrabold mt-1">{program.name}</h3>
            <p className="text-white/80 text-sm mt-0.5">{program.short}</p>
          </div>
          <div className="text-3xl font-black opacity-20">{program.short}</div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{program.duration}</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{program.seats} seats</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>

        <div className="mt-3 text-sm text-gray-500 flex items-start gap-1.5">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
          <span><strong className="text-gray-700">Eligibility:</strong> {program.eligibility}</span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {expanded ? 'Hide Subjects' : 'View Key Subjects'}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {program.subjects.map((sub) => (
              <div key={sub} className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-gray-700 font-medium">
                {sub}
              </div>
            ))}
          </div>
        )}

        <Link
          to="/bachelor/contact"
          className="inline-flex items-center gap-2 mt-5 w-full justify-center py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-all"
        >
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function Programs() {
  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Academic Programs</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find Your Perfect Program
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Choose from our TU-affiliated undergraduate programs designed to shape your future career.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 px-6 text-center text-white">
        <h2 className="text-2xl font-extrabold mb-2">Have Questions?</h2>
        <p className="text-blue-200 mb-5">Our admissions team is here to help you find the right program.</p>
        <Link
          to="/bachelor/contact"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
        >
          Contact Admissions <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
