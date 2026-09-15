import React from 'react';

const About = () => {
  return (
    <section className="py-24 px-6 md:px-16 bg-white" id="about">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text Content */}
        <div>
          <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-3">
            Who We Are
          </h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-7 text-gray-900 leading-tight">
            About <span className="text-[#da251c]">Akshar</span>
          </h2>
          <p className="text-gray-600 text-[15px] sm:text-base leading-relaxed mb-8">
            It is a matter of great honor for the Akshar family that Vishwa Adarsha college, Itahari, has stepped into the 28 years of the glorious march towards imparting quality education to the students, particularly in the Eastern region of Nepal. We proudly acknowledge the participation of the teachers, students, parents, and the general public to make this institution a center for academic excellence in this beautiful town. We feel proud to share our success that we have successfully produced some of the best minds in the country.
          </p>
          <a
            href="#faculties"
            className="inline-block bg-[#da251c] text-white px-8 py-3.5 rounded-sm font-bold text-sm hover:bg-red-700 transition-colors shadow hover:shadow-md"
          >
            Learn More
          </a>
        </div>

        {/* Right: Image with Experience Badge */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Akshar College Campus and Students"
            className="w-full object-cover h-[420px] md:h-[460px] rounded-sm shadow-md"
          />
          {/* Badge at bottom left */}
          <div className="absolute bottom-0 left-0 bg-[#da251c] text-white p-5 sm:p-6 w-36 sm:w-40 text-center shadow-lg">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-1">15 +</h3>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              Years Experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
