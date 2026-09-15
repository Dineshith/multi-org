import React from "react";

const feeData = [
  { sn: 1, course: "Management XI", admission: "Rs. 5000/-", annual: "Rs. 20,000/-", monthly: "Rs.4,500/-", total: "Rs.79,000/-" },
  { sn: 2, course: "Computer Science XI", admission: "Rs. 5000/-", annual: "Rs. 20,000/-", monthly: "Rs.5,000/-", total: "Rs.85,000/-" },
  { sn: 3, course: "Hotel Management XI", admission: "Rs. 5000/-", annual: "Rs. 25,000/-", monthly: "Rs.6,000/-", total: "Rs.1,02,000/-" },
  { sn: 4, course: "Science XI", admission: "Rs. 5000/-", annual: "Rs. 25,000/-", monthly: "Rs.6,000/-", total: "Rs.1,02,000/-" },
  { sn: 5, course: "Science XII", admission: "0", annual: "Rs. 25,000/-", monthly: "Rs.6,000/-", total: "Rs.97,000/-" },
  { sn: 6, course: "Business", admission: "0", annual: "Rs. 20,000/-", monthly: "Rs.4,500/-", total: "Rs.74,000/-" },
  { sn: 7, course: "Computer Science XII", admission: "0", annual: "Rs. 20,000/-", monthly: "Rs.5,000/-", total: "Rs.80,000/-" },
  { sn: 8, course: "Hotel Management XII", admission: "0", annual: "Rs. 25,000/-", monthly: "Rs.6,000/-", total: "Rs.97,000/-" },
];

export default function FeeStructure() {
  return (
    <div className="w-full bg-white text-gray-800 font-sans">
    
      <div 
        className="w-full h-72 md:h-80 bg-cover bg-center relative flex items-center px-8 md:px-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200')`
        }}
      >
        <div className="relative z-10">
          <div className="w-12 h-1 bg-red-600 mb-3"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-md">
            Fee Structure
          </h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-16 px-4 md:px-8">
        <div className="overflow-x-auto">
       <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
            <thead>
              <tr className="border-b-2 border-gray-300 text-gray-900 font-bold text-sm md:text-base">
                <th className="py-4 px-3">S.N</th>
                <th className="py-4 px-3">Course Name</th>
                <th className="py-4 px-3">Admission Fee</th>
                <th className="py-4 px-3">Annual Fee & Other</th>
                <th className="py-4 px-3">Monthly Fee</th>
                <th className="py-4 px-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm md:text-base text-gray-800">
              {feeData.map((item) => (
                <tr key={item.sn} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-3 text-gray-600">{item.sn}</td>
                  <td className="py-5 px-3 font-semibold text-gray-900">{item.course}</td>
                  <td className="py-5 px-3">{item.admission}</td>
                  <td className="py-5 px-3">{item.annual}</td>
                  <td className="py-5 px-3">{item.monthly}</td>
                  <td className="py-5 px-3 font-bold text-gray-900">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
    </div>
  );
}