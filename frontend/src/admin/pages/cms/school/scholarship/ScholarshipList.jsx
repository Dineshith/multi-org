import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Save, Check, ArrowLeft } from 'lucide-react';

export default function SchoolScholarshipList() {
  const defaultScholarships = [
    { id: 1, sn: "1", position: "1st Position", details: "100% Admission Fee + 100% Tuition Fee upto 1st Term" },
    { id: 2, sn: "2", position: "2nd Position", details: "75% Admission Fee + 50% Tuition Fee upto 1st Term" },
    { id: 3, sn: "3", position: "3rd Position", details: "50% Admission Fee + 25% Tuition Fee upto 1st Term" }
  ];

  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_scholarship_list');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(defaultScholarships);
    }
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem('cms_school_scholarship_list', JSON.stringify(list));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAdd = () => {
    setEditingItem({
      id: Date.now(),
      sn: `${items.length + 1}`,
      position: "",
      details: ""
    });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    let updated;
    if (items.find(it => it.id === editingItem.id)) {
      updated = items.map(it => it.id === editingItem.id ? editingItem : it);
    } else {
      updated = [...items, editingItem];
    }
    setItems(updated);
    saveToStorage(updated);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scholarship position?")) {
      const updated = items.filter(it => it.id !== id);
      setItems(updated);
      saveToStorage(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Scholarship Criteria & Positions</h2>
          <p className="text-sm text-slate-500 mt-1">Configure merit waivers, entrance scholarship criteria, and awards.</p>
        </div>
        {!editingItem && (
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Scholarship Rule
          </button>
        )}
      </div>

      {isSaved && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 border-b border-emerald-100">
          <Check className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}

      <div className="p-8">
        {editingItem ? (
          <form onSubmit={handleSaveItem} className="max-w-xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scholarship List
            </button>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">S.N</label>
                <input
                  type="text"
                  required
                  value={editingItem.sn}
                  onChange={(e) => setEditingItem({ ...editingItem, sn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rank / Position</label>
                <input
                  type="text"
                  required
                  value={editingItem.position}
                  onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                  placeholder="e.g. 1st Position"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Scholarship Benefits / Details</label>
              <textarea
                rows={4}
                required
                value={editingItem.details}
                onChange={(e) => setEditingItem({ ...editingItem, details: e.target.value })}
                placeholder="e.g. 100% Admission Fee + 100% Tuition Fee upto 1st Term"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              ></textarea>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Scholarship
              </button>
            </div>
          </form>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 px-4 w-20">S.N</th>
                  <th className="py-3 px-4 w-1/3">Position / Rank</th>
                  <th className="py-3 px-4">Scholarship Waiver Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-700">{it.sn}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{it.position}</td>
                    <td className="py-3.5 px-4 text-slate-600">{it.details}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingItem(it)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(it.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
