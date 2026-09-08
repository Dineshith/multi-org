import React from 'react';

const scholarshipData = [
  { sn: "1", position: "1st Position", details: "100% Admission Fee + 100% Tution Fee upto 1st Term" },
  { sn: "2", position: "2nd Position", details: "75% Admission Fee + 50% Tution Fee upto 1st Term" },
];

const ScholarshipList = () => {
  return (
    <div className="py-20 px-8 md:px-24 max-w-5xl mx-auto min-h-[40vh]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 px-4 font-bold text-gray-900 w-20">S.n</th>
              <th className="py-4 px-4 font-bold text-gray-900 w-1/3">Position</th>
              <th className="py-4 px-4 font-bold text-gray-900">Scholarship</th>
            </tr>
          </thead>
          <tbody>
            {scholarshipData.map((row, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                <td className="py-6 px-4 font-medium text-gray-900">{row.sn}</td>
                <td className="py-6 px-4 text-gray-900 font-semibold">{row.position}</td>
                <td className="py-6 px-4 text-gray-900 font-medium">{row.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScholarshipList;