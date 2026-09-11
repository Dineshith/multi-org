import React from 'react';

const AdministratorsHero = () => {
  return (
    <div 
      className="relative w-full h-[400px] flex flex-col justify-center px-8 md:px-24 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 flex flex-col items-start" style={{ fontFamily: "'Jost', 'Century Gothic', sans-serif" }}>
        <div className="w-12 h-1 bg-[#da251c] mb-6"></div>
        <h1 className="text-3xl md:text-[40px] font-semibold tracking-wide drop-shadow-md">
          Our Administrators
        </h1>
      </div>
    </div>
  );
};

export default AdministratorsHero;