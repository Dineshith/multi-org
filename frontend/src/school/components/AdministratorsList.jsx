import React from 'react';

const adminData = [
  { sn: "1", name: "Ganesh Kumar Dulal", phone: "9852048927", role: "Principal" },
  { sn: "2", name: "Mohan P Niraula", phone: "9852048927", role: "Vice- Principal" },
  { sn: "3", name: "Shova Devi Niraula", phone: "9852048927", role: "Secondary Co-ordinator" },
  { sn: "4", name: "Rina Poudel", phone: "9852048927", role: "Admin Incharge" },
  { sn: "5", name: "Mankumari Poudel", phone: "9852048927", role: "Account Officer" },
  { sn: "6", name: "Gitesh Dhungana", phone: "9852048927", role: "Nurse" },
  { sn: "7", name: "Hem Chandra Poudel", phone: "9852048927", role: "IT Incharge" },
];

const AdministratorsList = () => {
  return (
    <div className="py-16 px-8 md:px-24 max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 px-4 font-bold text-gray-900 w-20">S.n</th>
              <th className="py-4 px-4 font-bold text-gray-900 w-1/3">Administrator name</th>
              <th className="py-4 px-4 font-bold text-gray-900">Phone</th>
              <th className="py-4 px-4 font-bold text-gray-900">Administrator Role</th>
            </tr>
          </thead>
          <tbody>
            {adminData.map((row, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                <td className="py-5 px-4 font-medium text-gray-900">{row.sn}</td>
                <td className="py-5 px-4 text-gray-900 font-semibold">{row.name}</td>
                <td className="py-5 px-4 text-gray-900 font-semibold">{row.phone}</td>
                <td className="py-5 px-4 text-gray-900 font-semibold">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministratorsList;