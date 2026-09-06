import React from 'react';

const Hero = () => {
  return (
    <>
    <div 
        className="relative w-full h-[500px] flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Inline style प्रयोग गरेर फन्ट फोर्स गरिएको छ */}
        <div 
          className="relative z-10 px-4 flex flex-col items-center"
          style={{ fontFamily: "'Jost', 'Century Gothic', sans-serif" }}
        >
          <h1 className="text-[36px] md:text-[48px] font-medium mb-6 tracking-wide text-white drop-shadow-md">
            Trusted by more than 50000+ students
          </h1>
          <p className="text-[18px] md:text-[22px] font-normal tracking-wide text-white drop-shadow-md">
            "Be a part of this amazing institution"
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;