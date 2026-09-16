import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full h-[520px] md:h-[580px] overflow-hidden flex items-center justify-center text-center">
      {/* Background Image: Graduation Caps in the Air */}
      <img
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80"
        alt="Graduation Caps Tossed in Air"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Blue / Dark Gradient Overlay matching image aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1a30]/75 via-[#0c1a30]/55 to-[#0c1a30]/85" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center">
        <span className="inline-block bg-[#da251c] text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide shadow-sm">
          Trusted by more than 10,000+ alumni & students
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight md:leading-snug mb-4">
          World-Class Bachelor Education for Future Leaders
        </h1>

        <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-8">
          Empowering ambitious minds with cutting-edge curricula, hands-on industry training, and visionary mentorship in Computer Applications, Business, and Social Sciences.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#faculties"
            className="bg-[#da251c] hover:bg-red-700 text-white font-bold px-7 py-3 rounded text-sm transition-all shadow-lg hover:-translate-y-0.5"
          >
            Explore Programs
          </a>
          <a
            href="#notices"
            className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 font-semibold px-7 py-3 rounded text-sm transition-all"
          >
            Notice Board
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
