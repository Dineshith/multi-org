import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Star, Users, BookOpen, Award, ArrowRight } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To provide quality higher education that equips students with the knowledge, skills, and values needed to excel in a rapidly changing world.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be a leading institution recognized for academic excellence, research innovation, and community impact across Nepal and beyond.' },
  { icon: Star, title: 'Our Values', desc: 'Integrity, excellence, innovation, inclusivity, and respect guide everything we do at our institution.' },
];

const milestones = [
  { year: '2055 BS', event: 'Founded as a community college' },
  { year: '2060 BS', event: 'Received permanent affiliation from Tribhuvan University' },
  { year: '2065 BS', event: 'Launched BCA and CSIT programs' },
  { year: '2070 BS', event: 'ISO 9001 Certification received' },
  { year: '2075 BS', event: 'State-of-the-art computer lab and library inaugurated' },
  { year: '2080 BS', event: 'Achieved 90%+ pass rate for consecutive 5 years' },
];

const stats = [
  { icon: Users, label: 'Students Enrolled', value: '1,200+' },
  { icon: BookOpen, label: 'Programs Offered', value: '5+' },
  { icon: Award, label: 'Years of Excellence', value: '25+' },
  { icon: Star, label: 'Pass Rate', value: '90%+' },
];

export default function About() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Shaping Futures Through<br />Quality Education
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            For over 25 years, we have been committed to providing world-class education that prepares students to lead, innovate, and serve.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center text-white">
              <Icon className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="text-blue-200 text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">What Drives Us</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our mission, vision, and values are the foundation of everything we do.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Journey</h2>
            <p className="text-gray-500 mt-3">Key milestones in our history of excellence.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200" />
            <div className="flex flex-col gap-6">
              {milestones.map(({ year, event }, i) => (
                <div key={i} className="flex items-start gap-6 pl-2">
                  <div className="relative z-10 w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center leading-tight shrink-0">
                    {year.split(' ').map((w, j) => <div key={j}>{w}</div>)}
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex-1 mt-1">
                    <p className="text-gray-800 font-semibold">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Ready to Join Us?</h2>
        <p className="text-gray-500 mb-6">Explore our programs and take the first step toward your future.</p>
        <Link
          to="/bachelor/programs"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
        >
          View Programs <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
