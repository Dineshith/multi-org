import React from 'react';

const Research = () => {
  const researchData = [
    {
      id: 1,
      topic: 'JOVAC VOL 1',
      year: '2024-06-30',
      level: '',
      type: 'Journal',
      writer: 'RIC Community Team',
      file: '#'
    },
    {
      id: 2,
      topic: 'JOVAC VOL 1',
      year: '2024-06-30',
      level: '',
      type: 'Journal',
      writer: 'RIC Community Team',
      file: '#'
    },
    {
      id: 3,
      topic: 'JOVAC VOL 1',
      year: '2024-06-30',
      level: '',
      type: 'Journal',
      writer: 'RIC Community Team',
      file: '#'
    },
    {
      id: 4,
      topic: 'JOVAC VOL 1',
      year: '2024-06-30',
      level: '',
      type: 'Journal',
      writer: 'RIC Community Team',
      file: '#'
    },
    {
      id: 5,
      topic: 'JOVAC VOL 1',
      year: '2024-06-30',
      level: '',
      type: 'Journal',
      writer: 'RIC Community Team',
      file: '#'
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      {/* Header Section with Background Image */}
      <div className="relative h-[400px] w-full flex items-center justify-center bg-gray-900">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
            Research & Publication
          </h1>
        </div>
      </div>

      {/* Content Section - Table */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-center whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">TOPIC</th>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">YEAR</th>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">LEVEL</th>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">TYPE</th>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">WRITER</th>
                  <th className="py-5 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">FILE/PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {researchData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-5 px-6 text-sm text-gray-800 font-medium">{item.topic}</td>
                    <td className="py-5 px-6 text-sm text-gray-600">{item.year}</td>
                    <td className="py-5 px-6 text-sm text-gray-500">
                      <a href={item.level} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                        {item.level}
                      </a>
                    </td>
                    <td className="py-5 px-6 text-sm text-gray-600">{item.type}</td>
                    <td className="py-5 px-6 text-sm text-gray-600">{item.writer}</td>
                    <td className="py-5 px-6 text-sm font-medium">
                      <a href={item.file} className="text-gray-700 hover:text-blue-600">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
