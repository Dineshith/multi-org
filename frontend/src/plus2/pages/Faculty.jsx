import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

export default function Faculty() {
  const faculties = [
    {
      name: 'Dr. Ramesh Sharma',
      role: 'Principal (+2 Wing) & Senior Physics Lecturer',
      dept: 'Department of Science',
      qualification: 'Ph.D. in Applied Physics, Tribhuvan University',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Prof. Anupama Karki',
      role: 'Head of Department (Chemistry)',
      dept: 'Department of Science',
      qualification: 'M.Sc. in Organic Chemistry, 18+ Years Experience',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Binod Shrestha',
      role: 'HOD (Management & Accountancy)',
      dept: 'Department of Management',
      qualification: 'M.B.S., CA Inter, Renowned Author',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Er. Prakash Adhikari',
      role: 'Lecturer in Computer Science',
      dept: 'Department of IT & Computer',
      qualification: 'B.E. Computer Engineering, Full-Stack Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Dr. Sunita Basnet',
      role: 'Senior Biology Lecturer',
      dept: 'Department of Science',
      qualification: 'Ph.D. in Botany, CEE Entrance Specialist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Kiran Thapa',
      role: 'Lecturer in Mathematics',
      dept: 'Department of Science',
      qualification: 'M.Sc. in Mathematics, IOE Entrance Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      <div 
        className="w-full h-72 md:h-80 bg-cover bg-center relative flex items-center px-8 md:px-20"
        style={{
          backgroundImage: `linear-gradient(rgba(12, 26, 48, 0.8), rgba(12, 26, 48, 0.95)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200')`
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <div className="w-12 h-1.5 bg-red-600 mb-3"></div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md">
            Our Distinguished Faculty (+2)
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Mentors, authors, and researchers dedicated to transforming students into top performers.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculties.map((f, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-60 w-full overflow-hidden bg-slate-200">
                <img 
                  src={f.image} 
                  alt={f.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                  {f.dept}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{f.name}</h3>
                <p className="text-sm font-semibold text-blue-900 mb-2">{f.role}</p>
                <div className="flex items-start gap-2 text-xs text-gray-600 pt-3 border-t border-slate-200">
                  <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{f.qualification}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
