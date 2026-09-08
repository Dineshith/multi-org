import React from 'react';

const NoticeBoard = () => {
  const events = [
    { date: '10', month: 'Jun', title: 'Parenting Program', desc: 'Smart Parenting session in Progress.' },
    { date: '29', month: 'May', title: 'Parents Day 2085', desc: 'We are excited to announce that parent\'s day' },
    { date: '10', month: 'Jun', title: 'Annual Sports Meet', desc: 'A great journey begins with a single step. Get rea...' },
  ];

  const notices = [
    { date: 'May-21-2026', title: 'Grade 11 Scholarship Entrance Exam 2083 Exam Bus Routes' },
    { date: 'May-21-2026', title: 'Final call for Grade XII' },
    { date: 'May-20-2026', title: 'Admission Inquiry open for Grade XI' },
    { date: 'May-20-2026', title: 'Entrance & Scholarship Exam' },
    { date: 'May-20-2026', title: 'Entrance & Scholarship Exam' },
  ];

  return (
    <div className="bg-[#e5e7eb] py-16 px-6 md:px-16">
      <div className="text-center mb-12">
        <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-2">Notice Boards</h4>
        <h2 className="text-3xl font-extrabold text-gray-900">Upcoming events & Recent Notices</h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Events List */}
        <div className="lg:col-span-2 space-y-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white p-5 flex items-center gap-6 shadow-sm rounded">
              <div className="border-[3px] border-gray-900 px-4 py-2 text-center w-[72px] rounded-sm shrink-0">
                <div className="font-bold text-xl leading-none mb-1">{event.date}</div>
                <div className="text-xs font-bold uppercase">{event.month}</div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Notices Panel */}
        <div className="bg-white shadow-sm rounded overflow-hidden flex flex-col h-full">
          <div className="bg-[#da251c] text-white font-bold py-4 px-6 text-lg">
            Notice Boards
          </div>
          <div className="p-6 flex-1 space-y-5">
            {notices.map((notice, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <span className="text-xs text-gray-400 font-medium block mb-1">{notice.date}</span>
                <p className="text-sm font-semibold text-gray-800 hover:text-[#da251c] cursor-pointer leading-snug">{notice.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoticeBoard;