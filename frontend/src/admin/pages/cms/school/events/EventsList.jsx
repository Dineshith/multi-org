import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Save, Check, ArrowLeft } from 'lucide-react';

export default function SchoolEventsList() {
  const defaultEvents = [
    { id: 1, day: "29", month: "May", title: "Parenting Program", desc: "Smart Parenting Session in Progress." },
    { id: 2, day: "29", month: "May", title: "Parent's Day 2083", desc: "We are excited to announce that Parent's Day..." },
    { id: 3, day: "29", month: "May", title: "Annual Sports Meet", desc: "Celebrating talent, teamwork, and determination..." },
    { id: 4, day: "29", month: "May", title: "Certification Ceremony Phase", desc: "Empowering teachers through lifelong learning..." },
    { id: 5, day: "29", month: "May", title: "Akshar Vertex", desc: "Welcome to Akshar Vertex 2026! We're thrilled..." },
    { id: 6, day: "29", month: "May", title: "Digital School Science Exhibition 2026", desc: "Get ready to witness brilliant ideas come to life..." }
  ];

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_events_page_list');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents(defaultEvents);
    }
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem('cms_school_events_page_list', JSON.stringify(list));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAdd = () => {
    setEditingEvent({
      id: Date.now(),
      day: "15",
      month: "Jun",
      title: "",
      desc: ""
    });
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    let updated;
    if (events.find(ev => ev.id === editingEvent.id)) {
      updated = events.map(ev => ev.id === editingEvent.id ? editingEvent : ev);
    } else {
      updated = [...events, editingEvent];
    }
    setEvents(updated);
    saveToStorage(updated);
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updated = events.filter(ev => ev.id !== id);
      setEvents(updated);
      saveToStorage(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">School Events Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Publish and organize events, activities, and school dates.</p>
        </div>
        {!editingEvent && (
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {isSaved && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 border-b border-emerald-100">
          <Check className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}

      <div className="p-8">
        {editingEvent ? (
          <form onSubmit={handleSaveEvent} className="max-w-xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Events List
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Day Number</label>
                <input
                  type="text"
                  required
                  value={editingEvent.day}
                  onChange={(e) => setEditingEvent({ ...editingEvent, day: e.target.value })}
                  placeholder="e.g. 29"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Month</label>
                <input
                  type="text"
                  required
                  value={editingEvent.month}
                  onChange={(e) => setEditingEvent({ ...editingEvent, month: e.target.value })}
                  placeholder="e.g. May or Jun"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Title</label>
              <input
                type="text"
                required
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                placeholder="e.g. Annual Sports Meet"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
              <textarea
                rows={4}
                required
                value={editingEvent.desc}
                onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                placeholder="Brief details about the event..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              ></textarea>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Event
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 rounded-xl border-2 border-slate-800 bg-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-black text-slate-900 leading-none">{ev.day}</span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase mt-0.5 leading-none">{ev.month}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingEvent(ev)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
