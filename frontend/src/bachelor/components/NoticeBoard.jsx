import React from 'react';

const NoticeBoard = () => {
  const events = [
    {
      date: '17',
      month: 'Dec',
      title: 'Orientation & Induction Program 2026',
      desc: 'Smart leadership and undergraduate curriculum orientation session for incoming cohorts.',
    },
    {
      date: '24',
      month: 'Jan',
      title: 'Convocation Day 2026',
      desc: 'Celebrating the achievements of graduating bachelor students with honorable university dignitaries.',
    },
    {
      date: '03',
      month: 'Feb',
      title: 'Annual IT & Business Innovation Expo',
      desc: 'Showcasing student-driven web solutions, AI demos, business model pitches, and social initiatives.',
    },
  ];

  const notices = [
    {
      date: 'May-21-2026',
      title: 'BCA 8th Semester Final Project Defense & Internship Report Submission Schedule',
    },
    {
      date: 'May-21-2026',
      title: 'BBS 4th Year TU Board Examination Routine & Center List Published',
    },
    {
      date: 'May-20-2026',
      title: 'Admission Inquiry & Entrance Registration Open for BCA, BBS & BSW (2026/27)',
    },
    {
      date: 'May-20-2026',
      title: 'Entrance & Merit Scholarship Examination Guidelines for New Applicants',
    },
    {
      date: 'May-18-2026',
      title: 'Pre-Board Examination Schedule for 2nd, 4th & 6th Semesters',
    },
  ];

  return (
    <section className="bg-[#e5e7eb] py-16 px-6 md:px-16" id="notices">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-2">Notice Boards</h4>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Upcoming events & Recent Notices
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Events List (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-sm rounded border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Date Box */}
                <div className="border-[2.5px] border-gray-900 px-3 py-2 text-center w-[68px] sm:w-[74px] rounded-sm shrink-0 bg-gray-50">
                  <div className="font-extrabold text-xl sm:text-2xl text-gray-900 leading-none mb-1">
                    {event.date}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    {event.month}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Notices Panel with Red Header */}
          <div className="bg-white shadow-sm rounded overflow-hidden flex flex-col border border-gray-100">
            {/* Header */}
            <div className="bg-[#da251c] text-white font-bold py-4 px-6 text-lg tracking-wide flex items-center justify-between">
              <span>Notice Boards</span>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded font-normal">Recent</span>
            </div>

            {/* List */}
            <div className="p-6 flex-1 divide-y divide-gray-200">
              {notices.map((notice, index) => (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <span className="text-xs text-gray-400 font-medium block mb-1">
                    {notice.date}
                  </span>
                  <a
                    href="#notices"
                    className="text-[13.5px] font-semibold text-gray-800 hover:text-[#da251c] transition-colors leading-snug block no-underline"
                  >
                    {notice.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoard;
