import React from 'react';

export default function Scholarship() {
  const scholarshipData = [
    { sn: "1", position: "1st Position", scholarship: "100% Admission Fee + 100% Tution Fee upto 1st Term" },
    { sn: "1", position: "2nd Position", scholarship: "75% Admission Fee + 50% Tution Fee upto 1st Term" },
    { sn: "1", position: "3rd Position", scholarship: "70% Admission Fee + 25% Tution Fee upto 1st Term" },
    { sn: "1", position: "4th Position", scholarship: "65% Admission Fee" },
    { sn: "1", position: "5th Position", scholarship: "60% Admission Fee" },
    { sn: "1", position: "6th Position", scholarship: "55% Admission Fee" },
    { sn: "1", position: "7th Position", scholarship: "50% Admission Fee" },
    { sn: "1", position: "8th Position", scholarship: "45% Admission Fee" },
    { sn: "1", position: "9th Position", scholarship: "40% Admission Fee" },
    { sn: "1", position: "10th Position", scholarship: "35% Admission Fee" },
    { sn: "1", position: "11th to 15th Position", scholarship: "25% Admission Fee" },
    { sn: "1", position: "16th to 20th Position", scholarship: "20% Admission Fee" },
  ];

  return (
    <div className="w-full flex flex-col bg-white">
      
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center overflow-hidden bg-black">
        <img 
          src="/images/tuimg.png" 
          alt="Graduation Caps" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920";
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full">
          <div className="w-16 h-1.5 bg-[#FF2A2A] mb-6"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-tight mb-4 tracking-wide max-w-4xl drop-shadow-md">
            Trusted by more than 50000+ students
          </h1>
          <p className="text-lg md:text-xl text-white italic font-medium drop-shadow-md">
            "Be a part of this amazing institution"
          </p>
        </div>
      </div>

      <div className="w-full py-16 px-4 sm:px-8 md:px-16 bg-white flex justify-center mb-12">
        <div className="max-w-5xl w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100 p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-gray-900 font-bold text-base sm:text-lg">
                <th className="py-4 px-4 w-24">S.n</th>
                <th className="py-4 px-4 w-1/3">Position</th>
                <th className="py-4 px-4">Scholarship</th>
              </tr>
            </thead>
            <tbody>
              {scholarshipData.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-gray-800 text-sm sm:text-base font-medium">
                  <td className="py-4 px-4">{item.sn}</td>
                  <td className="py-4 px-4 font-semibold">{item.position}</td>
                  <td className="py-4 px-4 text-gray-700">{item.scholarship}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}