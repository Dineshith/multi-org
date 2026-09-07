import React from 'react';

const AboutHero = () => {
  return (
    <div 
      className="relative w-full h-[400px] flex flex-col justify-center px-8 md:px-24 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 flex flex-col items-start" style={{ fontFamily: "'Jost', 'Century Gothic', sans-serif" }}>
        <div className="w-12 h-1 bg-[#da251c] mb-6"></div>
        <h1 className="text-3xl md:text-[40px] font-semibold mb-4 tracking-wide drop-shadow-md">
          We strengthen students
        </h1>
        <p className="text-lg md:text-xl font-normal tracking-wide drop-shadow-md">
          "Providing Quality Education to Help Children Grow."
        </p>
      </div>
    </div>
  );
};

export default AboutHero;