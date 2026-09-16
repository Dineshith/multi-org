import React from 'react';

const WhatWeOffer = () => {
  const programs = [
    {
      title: 'Bachelor of Computer Application (BCA)',
      short: 'BCA',
      duration: '4 Years (8 Semesters)',
      desc: 'Our BCA program provides rigorous training in computer programming, software engineering, cloud computing, database administration, and emerging AI technologies with cutting-edge lab sessions and real-world internships.',
    },
    {
      title: 'Bachelor of Business Studies (BBS)',
      short: 'BBS',
      duration: '4 Years (Annual System)',
      desc: 'Our BBS degree develops visionary entrepreneurs, marketing analysts, and financial consultants through comprehensive case study methods, organizational management, accounting principles, and leadership seminars.',
    },
    {
      title: 'Bachelor of Social Work (BSW)',
      short: 'BSW',
      duration: '4 Years (Annual System)',
      desc: 'The BSW curriculum blends academic excellence with hands-on community engagement, rural camps, social research, NGO internships, and humanitarian advocacy to prepare empathetic changemakers.',
    },
  ];

  return (
    <section className="bg-[#f3f4f6] py-20 px-6 md:px-16" id="faculties">
      <div className="max-w-6xl mx-auto">
        {/* Subtitle */}
        <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-3">
          What We Offer
        </h4>

        {/* Section Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 md:w-[48%] leading-tight tracking-tight">
            The best educational faculty for our students.
          </h2>
          <p className="text-gray-600 md:w-[48%] text-sm md:text-[15px] leading-relaxed mt-1">
            We got a long experience in teaching bachelor faculty with over 15,000+ alumni all over the world, empowering students through innovative pedagogy, research culture, and career-focused excellence.
          </p>
        </div>

        {/* 3 Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white p-8 sm:p-9 shadow-sm rounded-sm border-t-4 border-transparent hover:border-[#da251c] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#da251c] bg-red-50 px-2.5 py-1 rounded">
                    {program.duration}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">TU Affiliated</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#da251c] transition-colors leading-snug">
                  {program.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {program.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Full Curriculum
                </span>
                <span className="text-[#da251c] group-hover:translate-x-1 transition-transform text-sm font-bold">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
