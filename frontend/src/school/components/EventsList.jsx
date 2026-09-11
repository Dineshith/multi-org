import React from 'react';

const eventsData = [
  { day: "29", month: "May", title: "Parenting Program", desc: "Smart Parenting Session in Progress." },
  { day: "29", month: "May", title: "Parent's Day 2083", desc: "We are excited to announce that Parent's Day..." },
  { day: "29", month: "May", title: "Annual Sports Meet", desc: "Celebrating talent, teamwork, and determinati..." },
  { day: "29", month: "May", title: "Certification Ceremony Phase", desc: "Empowering teachers through lifelong learning..." },
  { day: "29", month: "May", title: "Akshar Vertex", desc: "Welcome to Akshar Vertex 2026! We're thrilled t..." },
  { day: "29", month: "May", title: "Certification Ceremony", desc: "Empowering teachers through lifelong learning..." },
  { day: "29", month: "May", title: "Quiz", desc: "Our Grade V, VI & VII students rocked the qui..." },
  { day: "29", month: "May", title: "Quiz", desc: "Our Grade VIII, IX & X students rocked the qu..." },
  { day: "29", month: "May", title: "Digital School Science Exhibition 2026", desc: "Get ready to witness brilliant ideas come to..." },
  { day: "29", month: "May", title: "Drawing Competition", desc: "Colors, creativity, and young talent! Grade..." },
  { day: "29", month: "May", title: "Handwriting Competition", desc: "Handwriting, creativity, and young talent! Grade..." },
  { day: "29", month: "May", title: "Akshar expo", desc: "We are excited to announce that the Akshar Expo..." }
];

const EventsList = () => {
  return (
    <div className="py-20 px-8 md:px-24 max-w-6xl mx-auto bg-[#fafafa]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {eventsData.map((item, i) => (
          <div key={i} className="flex items-center gap-6 bg-white p-6 shadow-[0_2px_15px_rgb(0,0,0,0.04)] rounded-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            {/* Date Box */}
            <div className="flex flex-col items-center justify-center border-2 border-black min-w-[55px] h-[65px]">
              <span className="font-bold text-[18px] leading-none">{item.day}</span>
              <span className="font-bold text-[13px] mt-1 leading-none">{item.month}</span>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-[14px] leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;