import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Save, Check } from 'lucide-react';

export default function SchoolWhatWeOffer() {
  const defaultItems = [
    {
      id: 1,
      title: '+ 2 Science',
      desc: "Our +2 science program offers the study of the natural world's behavior and structure through experimentation and observation."
    },
    {
      id: 2,
      title: '+ 2 Management',
      desc: "Our +2 management program offers the study of organizational activities, processes, principles and different types of managerial role."
    }
  ];

  const [heading, setHeading] = useState("The best educational faculty for our students.");
  const [subheading, setSubheading] = useState("We got a long experience in teaching science and commerce faculty with over 50,000+ alumni all over the world.");
  const [items, setItems] = useState(defaultItems);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_whatweoffer');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.heading) setHeading(data.heading);
      if (data.subheading) setSubheading(data.subheading);
      if (data.items) setItems(data.items);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cms_school_whatweoffer', JSON.stringify({ heading, subheading, items }));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), title: 'New Program', desc: 'Program details and curriculum description...' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(it => it.id !== id));
  };

  const updateItem = (id, field, val) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: val } : it));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/60">
      <div className="border-b border-slate-100 pb-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            School - What We Offer Section
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage introductory content and program cards for What We Offer.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Main Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subheading Description</label>
            <textarea
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Offered Programs / Cards</h3>
            <button
              onClick={addItem}
              className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Program Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={item.desc}
                    onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 resize-none"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
