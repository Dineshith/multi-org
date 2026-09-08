import React from 'react';

const messagesData = [
  {
    name: "Ram Prasad Sharma",
    designation: "Chairman",
    message: "It is an honor to be a part of this institution — which is preparing the next generation of officers, innovators, and world leaders. I am committed to continue this legacy in every way possible. Thank you.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sunita Shrestha",
    designation: "Principal",
    message: "I have a dream — that every child should get an opportunity to evolve into a role model in society. I have a dream — that working on this auspicious mission would truly transform the face of the world.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Krishna Bahadur Karki",
    designation: "Vice-Principal",
    message: "It's my wish and blessing that students of Akshar should be able to gather the knowledge and skill required for them to live a life of fulfillment and abundance. I will always be working to facilitate this process.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Kamala Adhikari",
    designation: "Academic Coordinator",
    message: "Our dedicated faculty works tirelessly to create a stimulating environment where students can explore their passions. We believe in nurturing both intellect and character for a brighter tomorrow.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const FacultyMessagesList = () => {
  return (
    <div className="py-24 px-8 md:px-24 max-w-6xl mx-auto flex flex-col gap-28">
      {messagesData.map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center group">
          
          <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-2' : 'md:order-1'}`}>
            <h2 className="text-3xl font-bold text-[#0c1a30] mb-1">{item.name}</h2>
            <h4 className="text-[#da251c] font-bold text-[13px] tracking-wider uppercase mb-6">{item.designation}</h4>
            <p className="text-gray-600 leading-relaxed text-[15px] font-medium">
              {item.message}
            </p>
          </div>

          {/* Image Container */}
          <div className={`${index % 2 !== 0 ? 'md:order-1' : 'md:order-2'}`}>
            <div className="relative overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgb(12,26,48,0.2)] transition-shadow duration-500">
              <img
                src={item.image}
                alt={item.name}
                /* grayscale बाट कलरमा जाने कोड */
                className="w-full h-[380px] object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-in-out transform hover:scale-105"
              />
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default FacultyMessagesList;