import React, { useState } from 'react';
import { Mail, Phone, BookOpen, Award } from 'lucide-react';

const departments = ['All', 'Computer Science', 'Management', 'Science', 'Administration'];

const faculty = [
  { id: 1, name: 'Dr. Ramesh Sharma', designation: 'HOD - Computer Science', dept: 'Computer Science', qualification: 'PhD (Computer Science, TU)', experience: '18 yrs', subject: 'Artificial Intelligence', initials: 'RS', color: 'from-blue-500 to-indigo-600', email: 'rsharma@college.edu.np', phone: '98XXXXXXXX' },
  { id: 2, name: 'Prof. Sunita Adhikari', designation: 'Associate Professor', dept: 'Computer Science', qualification: 'M.Sc. (CSIT)', experience: '12 yrs', subject: 'Data Structures & Algorithms', initials: 'SA', color: 'from-violet-500 to-purple-600', email: 'sadhikari@college.edu.np', phone: '98XXXXXXXX' },
  { id: 3, name: 'Mr. Bikash Thapa', designation: 'Lecturer', dept: 'Computer Science', qualification: 'MCA', experience: '8 yrs', subject: 'Web Technology & BCA', initials: 'BT', color: 'from-cyan-500 to-blue-600', email: 'bthapa@college.edu.np', phone: '98XXXXXXXX' },
  { id: 4, name: 'Dr. Sushila Poudel', designation: 'HOD - Management', dept: 'Management', qualification: 'PhD (Management, TU)', experience: '20 yrs', subject: 'Business Economics', initials: 'SP', color: 'from-amber-500 to-orange-600', email: 'spoudel@college.edu.np', phone: '98XXXXXXXX' },
  { id: 5, name: 'Mr. Nabin Karki', designation: 'Lecturer', dept: 'Management', qualification: 'MBA', experience: '6 yrs', subject: 'Marketing & Entrepreneurship', initials: 'NK', color: 'from-emerald-500 to-teal-600', email: 'nkarki@college.edu.np', phone: '98XXXXXXXX' },
  { id: 6, name: 'Dr. Anita Ghimire', designation: 'Associate Professor', dept: 'Science', qualification: 'PhD (Mathematics)', experience: '15 yrs', subject: 'Discrete Mathematics', initials: 'AG', color: 'from-rose-500 to-pink-600', email: 'aghimire@college.edu.np', phone: '98XXXXXXXX' },
  { id: 7, name: 'Mr. Prabhat Joshi', designation: 'Lecturer', dept: 'Computer Science', qualification: 'M.Sc. (IT)', experience: '5 yrs', subject: 'Database Management', initials: 'PJ', color: 'from-indigo-500 to-blue-700', email: 'pjoshi@college.edu.np', phone: '98XXXXXXXX' },
  { id: 8, name: 'Mrs. Kamala Bista', designation: 'Administration Head', dept: 'Administration', qualification: 'MBS', experience: '10 yrs', subject: 'Academic Affairs', initials: 'KB', color: 'from-slate-500 to-gray-700', email: 'kbista@college.edu.np', phone: '98XXXXXXXX' },
];

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState('All');

  const filtered = selectedDept === 'All' ? faculty : faculty.filter(f => f.dept === selectedDept);

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Our Team</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Faculty & Staff</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Meet our experienced and dedicated team of educators shaping the next generation.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {dept} {selectedDept === dept && `(${filtered.length})`}
            </button>
          ))}
        </div>

        {/* Faculty Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(member => (
            <div key={member.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all overflow-hidden group">
              {/* Card header with gradient avatar */}
              <div className={`bg-gradient-to-br ${member.color} p-6 flex flex-col items-center text-white`}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-3 ring-4 ring-white/20">
                  {member.initials}
                </div>
                <h3 className="font-extrabold text-center text-base leading-tight">{member.name}</h3>
                <p className="text-white/80 text-xs mt-1 text-center">{member.designation}</p>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Award className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{member.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{member.subject}</span>
                </div>
                <div className="text-xs text-blue-600 font-semibold bg-blue-50 rounded-lg px-2 py-1 text-center mt-1">
                  {member.experience} experience
                </div>
                <div className="flex flex-col gap-1 mt-1 border-t border-gray-100 pt-2">
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Mail className="w-3.5 h-3.5" />{member.email}
                  </a>
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Phone className="w-3.5 h-3.5" />{member.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
