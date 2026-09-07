import React from 'react';

const IntroducingAkshar = () => {
  return (
    <div className="py-20 px-8 md:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1">
        <img 
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Students learning" 
          className="w-full h-auto object-cover rounded-sm shadow-md"
        />
      </div>
      <div className="order-1 md:order-2">
        <div className="w-12 h-1 bg-[#da251c] mb-4"></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Introducing Akshar</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Vishwa Adarsha College, established in 2055 B.S. by a group of qualified and dedicated professionals, is one of the leading institutions in the eastern part of Nepal. It has been running its plus two programs right from its inception. It is an umbrella institution for plus two (Science & Management).
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          The college has its own beautiful buildings with a remarkable compound of Ten Katthas. It has basketball, volleyball, and table tennis courts inside its own premises. It has a beautiful garden within a...
        </p>
        <button className="bg-[#da251c] text-white px-8 py-3 font-semibold text-sm rounded-sm hover:bg-red-700 transition-colors">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default IntroducingAkshar;