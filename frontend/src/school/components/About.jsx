import React from 'react';

const About = () => {
  return (
    <div className="py-24 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Side */}
        <div>
          <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-3">Who We Are</h4>
          <h2 className="text-4xl font-extrabold mb-8 text-gray-900">About <span className="text-[#da251c]">Akshar</span></h2>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
            It is a matter of great honor for the Akshar family that Vishwa Adarsha college, Itahari, has stepped into the 28 years of the glorious march towards imparting quality education to the students, particularly in the Eastern region of Nepal. We proudly acknowledge the participation of the teachers, students, parents, and the general public to make this institution a center for academic excellence in this beautiful town. We feel proud to share our success that we have successfully produced some of the best minds in the country.
          </p>
          <button className="bg-[#da251c] text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-red-700 transition-colors">
            Learn More
          </button>
        </div>

        {/* Image Side */}
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Students smiling" 
            className="w-full object-cover h-[450px] rounded-sm shadow-lg"
          />
          {/* Badge */}
          <div className="absolute bottom-0 left-0 bg-[#da251c] text-white p-6 w-36 text-center shadow-lg">
            <h3 className="text-4xl font-extrabold mb-1">8 +</h3>
            <p className="text-xs font-bold uppercase tracking-wider">Years Experience</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default About;