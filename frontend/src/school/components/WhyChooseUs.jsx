import React from 'react';

const WhyChooseUs = () => {
  return (
    <div className="py-16 px-8 md:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <div className="w-12 h-1 bg-[#da251c] mb-4"></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why choose us</h2>
        <ul className="space-y-3 text-sm text-gray-700 font-medium">
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Experienced and student-oriented teaching faculties</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Quality education with excellent HSEB result</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Well-equipped building and ideal classrooms</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Peaceful academic environment</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Specially designed labs for exploring and experimenting</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Well-equipped library with recent publications</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Powerpoint presentation educational tours and fieldwork</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> diverse scholarship schemes and awards</li>
          <li className="flex items-start gap-3"><span className="text-black text-[10px] mt-1">●</span> Audio-visual classes remedial classes for the needy student</li>
        </ul>
      </div>
      <div>
        <img 
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Classroom" 
          className="w-full h-auto object-cover rounded-sm shadow-md"
        />
      </div>
    </div>
  );
};

export default WhyChooseUs;