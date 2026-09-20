import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Save, Check, Calendar } from 'lucide-react';

export default function SchoolNoticeBoard() {
  const defaultEvents = [
    { id: 1, date: '10', month: 'Jun', title: 'Parenting Program', desc: 'Smart Parenting session in Progress.' },
    { id: 2, date: '29', month: 'May', title: 'Parents Day 2085', desc: "We are excited to announce that parent's day" },
    { id: 3, date: '10', month: 'Jun', title: 'Annual Sports Meet', desc: 'A great journey begins with a single step. Get rea...' }
  ];

  const defaultNotices = [
    { id: 1, date: 'May-21-2026', title: 'Grade 11 Scholarship Entrance Exam 2083 Exam Bus Routes' },
    { id: 2, date: 'May-21-2026', title: 'Final call for Grade XII' },
    { id: 3, date: 'May-20-2026', title: 'Admission Inquiry open for Grade XI' },
    { id: 4, date: 'May-20-2026', title: 'Entrance & Scholarship Exam' }
  ];

  const [events, setEvents] = useState(defaultEvents);
  const [notices, setNotices] = useState(defaultNotices);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_noticeboard');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.events) setEvents(data.events);
      if (data.notices) setNotices(data.notices);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cms_school_noticeboard', JSON.stringify({ events, notices }));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addEvent = () => {
    setEvents([...events, { id: Date.now(), date: '01', month: 'Jul', title: 'New Event Title', desc: 'Event description here.' }]);
  };

  const removeEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const updateEvent = (id, field, val) => {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const addNotice = () => {
    setNotices([...notices, { id: Date.now(), date: 'Jun-01-2026', title: 'New Notice Headline' }]);
  };

  const removeNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const updateNotice = (id, field, val) => {
    setNotices(notices.map(n => n.id === id ? { ...n, [field]: val } : n));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/60">
      <div className="border-b border-slate-100 pb-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            School - Notice Board & Events
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage upcoming events and notices on the homepage notice board.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Events Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Upcoming Events ({events.length})
            </h3>
            <button
              onClick={addEvent}
              className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Event
            </button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ev.date}
                    onChange={(e) => updateEvent(ev.id, 'date', e.target.value)}
                    placeholder="Day"
                    className="w-16 px-3 py-1.5 text-center font-bold bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={ev.month}
                    onChange={(e) => updateEvent(ev.id, 'month', e.target.value)}
                    placeholder="Month"
                    className="w-20 px-3 py-1.5 text-center font-bold bg-white border border-slate-200 rounded-lg text-sm uppercase"
                  />
                  <input
                    type="text"
                    value={ev.title}
                    onChange={(e) => updateEvent(ev.id, 'title', e.target.value)}
                    placeholder="Event Title"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                  />
                  <button
                    onClick={() => removeEvent(ev.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={ev.desc}
                  onChange={(e) => updateEvent(ev.id, 'desc', e.target.value)}
                  placeholder="Event brief description..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notices Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              Recent Notices ({notices.length})
            </h3>
            <button
              onClick={addNotice}
              className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Notice
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((nt) => (
              <div key={nt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
                <input
                  type="text"
                  value={nt.date}
                  onChange={(e) => updateNotice(nt.id, 'date', e.target.value)}
                  placeholder="Date"
                  className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                />
                <input
                  type="text"
                  value={nt.title}
                  onChange={(e) => updateNotice(nt.id, 'title', e.target.value)}
                  placeholder="Notice title..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800"
                />
                <button
                  onClick={() => removeNotice(nt.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
