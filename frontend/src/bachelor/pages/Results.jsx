import React, { useState } from 'react';
import { ClipboardList, Search, ChevronDown, Image as ImageIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { WINGS, PROGRAMS } from '../../admin/config/orgConfig';

// Demo results stored from admin
const RESULTS_KEY = 'admin_results'; // same key as ResultManagement

function loadResults() {
  try {
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

const demoResults = [
  {
    id: 'demo1',
    title: 'BCA 5th Semester Result — 2080',
    examName: '5th Semester Regular Exam',
    date: '2081-05-01',
    imagePreview: null,
    demoText: 'Please visit the Tribhuvan University website or contact the examination office for detailed results.',
  },
  {
    id: 'demo2',
    title: 'CSIT 2nd Semester Result — 2080',
    examName: '2nd Semester Regular Exam',
    date: '2081-04-15',
    imagePreview: null,
    demoText: 'Results are available on the TU official portal and the college notice board.',
  },
];

export default function Results() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const storedResults = loadResults();
  const results = storedResults.length > 0 ? storedResults : demoResults;

  const filtered = results.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.examName && r.examName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 40% 60%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Academic Results</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Exam Results</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            View all published examination results. Results are released after official TU notification.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-3xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search results by title or exam name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="max-w-3xl mx-auto px-6 mt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700">
            <strong>Note:</strong> Results are published by Tribhuvan University. For official marksheet, please visit the TU controller of examinations office.
          </p>
        </div>
      </section>

      {/* Results List */}
      <section className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">No results found</p>
            <p className="text-sm mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          filtered.map(result => (
            <div key={result.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{result.title}</h3>
                    {result.examName && (
                      <p className="text-gray-500 text-sm mt-0.5">{result.examName}</p>
                    )}
                    {result.date && (
                      <p className="text-xs text-gray-400 mt-1">Published: {result.date}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === result.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {expandedId === result.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {result.imagePreview ? (
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <img src={result.imagePreview} alt={result.title} className="w-full object-contain max-h-[500px]" />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
                        {result.demoText || 'Result image not available. Please contact the examination office.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
