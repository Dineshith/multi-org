import React, { useState, useEffect } from 'react';
import { Bell, Pin, Tag, Calendar, Search, ChevronDown } from 'lucide-react';

const NOTICE_STORAGE_KEY = 'bachelor_notices';

// Demo notices (shown if none stored)
const demoNotices = [
  { id: 1, title: 'BCA 5th Semester Examination Routine Published', category: 'Exam', audience: 'BCA', isPinned: true, date: '2081-05-20', status: 'Active', content: 'The examination routine for BCA 5th Semester has been published. Students are requested to check the routine from the examination section.' },
  { id: 2, title: 'Admission Open for 2081/82 Academic Session', category: 'Admission', audience: 'All', isPinned: true, date: '2081-05-15', status: 'Active', content: 'Admissions are now open for BCA, CSIT, BBS, BIT, and BSc programs for the academic session 2081/82. Last date for application: 2081-06-30.' },
  { id: 3, title: 'Annual Cultural Program – Participation Notice', category: 'Event', audience: 'All', isPinned: false, date: '2081-05-10', status: 'Active', content: 'All students are invited to participate in the Annual Cultural Program scheduled for 2081-06-05. Registration forms available at the student section.' },
  { id: 4, title: 'CSIT 2nd Sem Result Published', category: 'Result', audience: 'CSIT', isPinned: false, date: '2081-04-28', status: 'Active', content: 'Results for CSIT 2nd Semester have been published on the TU website. Students can also check results at the college examination office.' },
  { id: 5, title: 'Holiday Notice – Dashain Vacation', category: 'Holiday', audience: 'All', isPinned: false, date: '2081-04-20', status: 'Active', content: 'The college will remain closed from 2081-06-25 to 2081-07-08 for Dashain festival. Classes will resume from 2081-07-09.' },
];

const CATEGORIES = ['All', 'Exam', 'Admission', 'Event', 'Result', 'Holiday', 'Scholarship', 'General'];

const categoryColors = {
  Exam: 'bg-blue-100 text-blue-700',
  Admission: 'bg-emerald-100 text-emerald-700',
  Event: 'bg-violet-100 text-violet-700',
  Result: 'bg-amber-100 text-amber-700',
  Holiday: 'bg-rose-100 text-rose-700',
  Scholarship: 'bg-orange-100 text-orange-700',
  General: 'bg-slate-100 text-slate-700',
};

export default function Notice() {
  const [notices, setNotices] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTICE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : demoNotices;
    } catch { return demoNotices; }
  });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = notices
    .filter(n => n.status === 'Active')
    .filter(n => selectedCategory === 'All' || n.category === selectedCategory)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Stay Updated</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Notice Board</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            All official notices, exam schedules, events, and announcements in one place.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </section>

      {/* Notices List */}
      <section className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">No notices found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          filtered.map(notice => (
            <div
              key={notice.id}
              className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden ${notice.isPinned ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100 hover:shadow-md'}`}
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notice.isPinned ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {notice.isPinned
                      ? <Pin className="w-5 h-5 text-blue-600" />
                      : <Bell className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {notice.isPinned && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">📌 Pinned</span>
                      )}
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColors[notice.category] || 'bg-gray-100 text-gray-600'}`}>
                        {notice.category}
                      </span>
                      {notice.audience !== 'All' && (
                        <span className="text-xs text-gray-500 font-medium bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                          {notice.audience}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{notice.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.date}
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === notice.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {expandedId === notice.id && notice.content && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 leading-relaxed pl-13">
                    <p className="pl-[52px]">{notice.content}</p>
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
