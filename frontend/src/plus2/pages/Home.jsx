import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Users, 
  Sparkles, 
  FlaskConical, 
  Briefcase, 
  Laptop, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  DollarSign
} from 'lucide-react';
import Plus2Gallery from '../component/Plus2Gallery';

export default function Home() {
  const streams = [
    {
      title: '+2 Science',
      icon: FlaskConical,
      color: 'bg-blue-600',
      badge: 'Most Popular',
      desc: 'Rigorous foundation in Physics, Chemistry, Biology, and Mathematics with dedicated Medical (CEE) and Engineering (IOE) preparation.',
      features: ['Modern Physics & Chemistry Labs', 'Biology Specimen Museum', 'Medical & IOE Mentorship', 'Weekly Model Tests']
    },
    {
      title: '+2 Management',
      icon: Briefcase,
      color: 'bg-emerald-600',
      badge: 'High Demand',
      desc: 'Comprehensive training in Business Studies, Accountancy, Economics, and Hotel Management with real-world case studies.',
      features: ['Accounting Software Labs', 'Entrepreneurship Workshops', 'Hotel Management Practical Kitchen', 'CA Foundation Guidance']
    },
    {
      title: '+2 Computer Science',
      icon: Laptop,
      color: 'bg-purple-600',
      badge: 'Tech Career',
      desc: 'Hands-on programming, database design, web application development, and algorithmic problem-solving.',
      features: ['High-Speed Computer Labs', 'Web Development Projects', 'Coding Competitions & Hackathons', 'Direct Pathway to BCA/BSc.CSIT']
    }
  ];

  const highlights = [
    {
      title: 'Top Board Results',
      desc: 'Consistent A+ grades and regional board toppers in NEB examinations year after year.',
      icon: Award
    },
    {
      title: 'Entrance Coaching',
      desc: 'Free integrated coaching for MBBS, Engineering, and CA entrance tests alongside regular classes.',
      icon: BookOpen
    },
    {
      title: 'Experienced Faculty',
      desc: 'Learn from seasoned professors, authors, and industry professionals dedicated to student success.',
      icon: Users
    },
    {
      title: 'Full Scholarships',
      desc: 'Up to 100% scholarships for GPA 3.6+ holders, school toppers, and deserving students.',
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative w-full min-h-[540px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#0c1a30] via-[#112445] to-[#1a365d]">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920"
          alt="Akshar Plus Two Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a30] via-transparent to-transparent opacity-80" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>NEB Affiliated Higher Secondary Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            Empowering Your Ambition at <br className="hidden sm:block" />
            <span className="text-red-500 underline decoration-white/20 underline-offset-8">Akshar Plus Two (+2)</span>
          </h1>

          <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-10 font-normal">
            A center of academic brilliance offering premier +2 programs in Science, Management, and Computer Science. Join 5,000+ alumni achieving greatness across medical, engineering, corporate, and entrepreneurial careers.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/plus2/scholarship"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-lg text-sm md:text-base transition-all shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 no-underline flex items-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>Scholarship Details</span>
            </Link>
            <Link
              to="/plus2/fee-structure"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-7 py-3.5 rounded-lg text-sm md:text-base backdrop-blur-md transition-all hover:-translate-y-0.5 no-underline flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              <span>Fee Structure</span>
            </Link>
            <Link
              to="/plus2/contact"
              className="bg-white text-blue-950 hover:bg-gray-100 font-bold px-7 py-3.5 rounded-lg text-sm md:text-base transition-all shadow-md hover:-translate-y-0.5 no-underline"
            >
              Admission Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Counter Bar */}
      <section className="w-full bg-[#0c1a30] border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black text-red-500">100%</div>
            <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider font-medium mt-1">NEB Pass Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-white">5,000+</div>
            <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider font-medium mt-1">Alumni Leaders</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-red-500">35+</div>
            <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider font-medium mt-1">Expert Lecturers</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-white">100%</div>
            <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider font-medium mt-1">Merit Scholarships</div>
          </div>
        </div>
      </section>

      {/* Streams Offered Section */}
      <section className="py-20 px-6 md:px-12 bg-slate-50" id="streams">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Academic Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
              Our Premier +2 Disciplines
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3">
              Tailored curricula designed to bridge high school with top universities in Nepal and abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {streams.map((stream, idx) => {
              const IconComp = stream.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl ${stream.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        {stream.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {stream.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {stream.desc}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-8">
                      {stream.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/plus2/fee-structure"
                    className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-red-600 hover:text-white text-gray-800 font-semibold py-3 rounded-lg text-sm transition-colors no-underline"
                  >
                    <span>View Fee & Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Akshar +2 Highlights */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Why Akshar Academy?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
              An Environment Built for High Achievers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scholarship Callout Banner */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Entrance 2026/27
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
              Merit & Need-Based Scholarships Available!
            </h2>
            <p className="text-white/90 text-sm sm:text-base mt-2 max-w-xl">
              Score up to 100% tuition and admission waivers on the basis of your SEE GPA and Entrance Examination results.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              to="/plus2/scholarship"
              className="bg-white text-red-700 hover:bg-gray-100 font-bold px-6 py-3.5 rounded-lg text-sm sm:text-base transition-all shadow-md no-underline"
            >
              See Criteria & Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
                Campus Life
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Moments at Akshar Plus Two
              </h2>
            </div>
            <Link
              to="/plus2/gallery"
              className="text-red-600 hover:text-red-700 font-bold text-sm flex items-center gap-1.5 no-underline group"
            >
              <span>Explore All Photos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Plus2Gallery />
        </div>
      </section>
    </div>
  );
}
