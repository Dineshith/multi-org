import React from 'react';

const tableData = [
  { sn: "1", name: "Ramesh Sharma", subject: "Maths/Opt-Math" },
  { sn: "2", name: "Sita Thapa", subject: "Grade Teacher" },
  { sn: "3", name: "Sunita Rai", subject: "Grade Teacher" },
  { sn: "4", name: "Bikash Tamang", subject: "Math/Economics" },
  { sn: "5", name: "Rajesh Gurung", subject: "Math" },
  { sn: "6", name: "Kabita Magar", subject: "Grade Teacher" },
  { sn: "7", name: "Pooja Karki", subject: "English" },
  { sn: "8", name: "Hari Prasad Acharya", subject: "Itahari Ko Sero Phero/Handwriting" },
  { sn: "9", name: "Sushma Khadka", subject: "Grade Teacher" },
  { sn: "10", name: "Prakash Dhakal", subject: "Computers" },
  { sn: "11", name: "Kamala Shrestha", subject: "Grade Teacher" },
  { sn: "12", name: "Sandeep Gautam", subject: "Social/ISF" },
  { sn: "13", name: "Sabina Chaudhary", subject: "Grade Teacher" },
  { sn: "14", name: "Nisha Limbu", subject: "Grade Teacher" },
  { sn: "15", name: "Saraswati Pandey", subject: "Grade Teacher" },
  { sn: "16", name: "Roshan Bhattarai", subject: "Science" },
  { sn: "17", name: "Bhawana Poudel", subject: "Grade Teacher" },
  { sn: "18", name: "Anu Basnet", subject: "Grade Teacher" },
  { sn: "19", name: "Suraj Maharjan", subject: "Martial Art" },
  { sn: "20", name: "Nabin Bista", subject: "English" },
  { sn: "21", name: "Goma Upreti", subject: "Nepali" },
  { sn: "22", name: "Asmita Kandel", subject: "Nepali" },
  { sn: "23", name: "Menuka Giri", subject: "Grade Teacher" },
  { sn: "24", name: "Santosh Lama", subject: "Art" },
  { sn: "25", name: "Sangita Dahal", subject: "Grade Teacher" },
  { sn: "26", name: "Parbati Neupane", subject: "Nepali" },
  { sn: "27", name: "Rupa Joshi", subject: "Grade Teacher" },
  { sn: "28", name: "Indira Aryal", subject: "Grade Teacher" },
  { sn: "29", name: "Kiran Sunar", subject: "Music" },
  { sn: "30", name: "Dipak Koirala", subject: "Social" },
  { sn: "31", name: "Alina Shakya", subject: "Dance" },
  { sn: "32", name: "Bishal Thakuri", subject: "English" },
  { sn: "33", name: "Milan Chhetri", subject: "Football" },
  { sn: "34", name: "Smriti Subba", subject: "Grade Teacher" },
  { sn: "35", name: "Priyanka Poudel", subject: "Grade Teacher" }
];

const TeachersList = () => {
  return (
    <div className="py-16 px-8 md:px-24 max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 px-4 font-bold text-gray-900 w-24">S.N</th>
              <th className="py-4 px-4 font-bold text-gray-900 w-1/3">Teacher Name</th>
              <th className="py-4 px-4 font-bold text-gray-900">Subject</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-bold text-gray-900">{row.sn}</td>
                <td className="py-4 px-4 text-gray-800">{row.name}</td>
                <td className="py-4 px-4 text-gray-800">{row.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersList;