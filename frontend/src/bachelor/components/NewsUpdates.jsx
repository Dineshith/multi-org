import React from 'react';

const NewsUpdates = () => {
  const newsItems = [
    {
      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      date: 'May 15, 2026',
      title: 'National Seminar on Cloud Computing & Modern Software Practices',
    },
    {
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      date: 'May 10, 2026',
      title: 'Student Spotlight: Celebrating National Academic & Research Excellence',
    },
    {
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      date: 'May 04, 2026',
      title: 'Inter-College Hackathon & Project Exhibition 2026 Concludes',
    },
    {
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
      date: 'Apr 28, 2026',
      title: 'Campus Greening Initiative & Sustainability Drive Launched',
    },
  ];

  return (
    <section className="py-20 px-6 md:px-16 bg-white border-t border-gray-100" id="news">
      <div className="max-w-6xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-3">
              News Updates
            </h4>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Read our latest <span className="text-[#da251c]">News & Updates.</span>
            </h2>
          </div>
          <button className="bg-[#da251c] text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-red-700 transition-colors whitespace-nowrap">
            View All
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group"
            >
              {/* Image Container */}
              <div className="overflow-hidden h-44 w-full bg-gray-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-2">
                    {item.date}
                  </span>
                  <h3 className="font-bold text-[14.5px] text-gray-900 leading-snug group-hover:text-[#da251c] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-xs font-semibold text-[#da251c]">
                  Read Story →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;
