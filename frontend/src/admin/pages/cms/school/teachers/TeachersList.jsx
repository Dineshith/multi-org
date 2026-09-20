import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Save, Check, Search, ArrowLeft } from 'lucide-react';

export default function SchoolTeachersList() {
  const defaultTeachers = [
    { id: 1, sn: "1", name: "Ramesh Sharma", subject: "Maths/Opt-Math" },
    { id: 2, sn: "2", name: "Sita Thapa", subject: "Grade Teacher" },
    { id: 3, sn: "3", name: "Sunita Rai", subject: "Grade Teacher" },
    { id: 4, sn: "4", name: "Bikash Tamang", subject: "Math/Economics" },
    { id: 5, sn: "5", name: "Rajesh Gurung", subject: "Math" },
    { id: 6, sn: "6", name: "Kabita Magar", subject: "Grade Teacher" },
    { id: 7, sn: "7", name: "Pooja Karki", subject: "English" },
    { id: 8, sn: "8", name: "Hari Prasad Acharya", subject: "Itahari Ko Sero Phero/Handwriting" },
    { id: 9, sn: "9", name: "Sushma Khadka", subject: "Grade Teacher" },
    { id: 10, sn: "10", name: "Prakash Dhakal", subject: "Computers" },
    { id: 11, sn: "11", name: "Kamala Shrestha", subject: "Grade Teacher" },
    { id: 12, sn: "12", name: "Sandeep Gautam", subject: "Social/ISF" },
    { id: 13, sn: "13", name: "Roshan Bhattarai", subject: "Science" }
  ];

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_teachers_list');
    if (saved) {
      setTeachers(JSON.parse(saved));
    } else {
      setTeachers(defaultTeachers);
    }
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem('cms_school_teachers_list', JSON.stringify(list));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAdd = () => {
    setEditingTeacher({
      id: Date.now(),
      sn: `${teachers.length + 1}`,
      name: '',
      subject: ''
    });
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    let updated;
    if (teachers.find(t => t.id === editingTeacher.id)) {
      updated = teachers.map(t => t.id === editingTeacher.id ? editingTeacher : t);
    } else {
      updated = [...teachers, editingTeacher];
    }
    setTeachers(updated);
    saveToStorage(updated);
    setEditingTeacher(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      saveToStorage(updated);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Teachers Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage school teaching faculty roster and assignments.</p>
        </div>
        {!editingTeacher && (
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Teacher
          </button>
        )}
      </div>

      {isSaved && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 border-b border-emerald-100">
          <Check className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}

      <div className="p-8">
        {editingTeacher ? (
          <form onSubmit={handleSaveTeacher} className="max-w-xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => setEditingTeacher(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Teachers List
            </button>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">S.N</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.sn}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, sn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Teacher Name</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject / Grade</label>
              <input
                type="text"
                required
                value={editingTeacher.subject}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                placeholder="e.g. Maths/Opt-Math or Grade Teacher"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Teacher
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 max-w-md bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teachers by name or subject..."
                className="bg-transparent text-sm w-full outline-none text-slate-700"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 px-4 w-20">S.N</th>
                    <th className="py-3 px-4">Teacher Name</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700">{t.sn}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{t.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.subject}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingTeacher(t)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
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
          </div>
        )}
      </div>
    </div>
  );
}
