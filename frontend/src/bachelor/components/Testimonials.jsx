import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'Vishwa Adarsha provided me with an exceptional foundation in software development. The professors are genuinely invested in student growth, and the modern computer labs gave me the confidence to step straight into a software engineering career right after graduation.',
      name: 'Aayush Karki',
      role: 'BCA Alumnus, Software Engineer',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'The business case competitions, corporate seminars, and passionate faculty transformed my strategic perspective. The BBS program at Akshar isn’t just about textbooks; it is a true launchpad for future entrepreneurs and corporate leaders.',
      name: 'Pooja Shrestha',
      role: 'BBS Graduate, Business Analyst',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'The fieldwork, rural immersion programs, and continuous mentorship in the BSW department shaped my analytical thinking and humanitarian ethics. It helped me land an impactful role in national NGO development programs.',
      name: 'Bikash Adhikari',
      role: 'BSW Alumnus, Program Officer NGO',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-[#f9fafb] border-t border-gray-200" id="testimonials">
      <div className="max-w-6xl mx-auto">
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-2">
            Word of Appreciation
          </h4>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Hear what our respected associates/students say about Vishwa Adarsha
          </h2>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Red Quotation Mark */}
                <div className="text-[#da251c] font-serif text-5xl font-black leading-none mb-4">
                  “
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-100"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
