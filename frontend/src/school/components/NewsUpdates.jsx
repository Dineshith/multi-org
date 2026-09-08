import React from 'react';

const NewsUpdates = () => {
  return (
    <div className="py-20 px-6 md:px-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h4 className="text-[#da251c] font-bold text-sm uppercase tracking-wider mb-4">News Updates</h4>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Read our latest News &<br /> <span className="text-[#da251c]">Updates.</span>
          </h2>
        </div>
        <button className="bg-[#da251c] text-white px-10 py-3 rounded-sm font-bold text-sm hover:bg-red-700 transition-colors whitespace-nowrap mb-2">
          View All
        </button>
      </div>
    </div>
  );
};

export default NewsUpdates;