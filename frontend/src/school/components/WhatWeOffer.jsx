import React from 'react';

const WhatWeOffer = () => {
  return (
    <div className="bg-[#f3f4f6] py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-4">What We Offer</h4>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 md:w-[45%] leading-tight">
            The best educational faculty for our students.
          </h2>
          <p className="text-gray-600 md:w-[50%] text-sm leading-relaxed mt-2">
            We got a long experience in teaching science and commerce faculty with over 50,000+ alumni all over the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 shadow-sm rounded-sm border-t-4 border-transparent hover:border-[#da251c] transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">+ 2 Science</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our +2 science program offers the study of the natural world's behavior and structure through experimentation and observation.
            </p>
          </div>
          <div className="bg-white p-10 shadow-sm rounded-sm border-t-4 border-transparent hover:border-[#da251c] transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">+ 2 Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our +2 management program offers the study of organizational activities, processes, principles and different types of managerial role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;