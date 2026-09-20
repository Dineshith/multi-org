import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, Save, Check, Search, ArrowLeft, Phone } from 'lucide-react';

export default function SchoolAdministratorsList() {
  const defaultAdmins = [
    { id: 1, sn: "1", name: "Ganesh Kumar Dulal", phone: "9852048927", role: "Principal" },
    { id: 2, sn: "2", name: "Mohan P Niraula", phone: "9852048927", role: "Vice- Principal" },
    { id: 3, sn: "3", name: "Shova Devi Niraula", phone: "9852048927", role: "Secondary Co-ordinator" },
    { id: 4, sn: "4", name: "Rina Poudel", phone: "9852048927", role: "Admin Incharge" },
    { id: 5, sn: "5", name: "Mankumari Poudel", phone: "9852048927", role: "Account Officer" },
    { id: 6, sn: "6", name: "Gitesh Dhungana", phone: "9852048927", role: "Nurse" },
    { id: 7, sn: "7", name: "Hem Chandra Poudel", phone: "9852048927", role: "IT Incharge" }
  ];

  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_administrators_list');
    if (saved) {
      setAdmins(JSON.parse(saved));
    } else {
      setAdmins(defaultAdmins);
    }
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem('cms_school_administrators_list', JSON.stringify(list));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAdd = () => {
    setEditingAdmin({
      id: Date.now(),
      sn: `${admins.length + 1}`,
      name: '',
      phone: '',
      role: ''
    });
  };

  const handleSaveAdmin = (e) => {
    e.preventDefault();
    let updated;
    if (admins.find(a => a.id === editingAdmin.id)) {
      updated = admins.map(a => a.id === editingAdmin.id ? editingAdmin : a);
    } else {
      updated = [...admins, editingAdmin];
    }
    setAdmins(updated);
    saveToStorage(updated);
    setEditingAdmin(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      const updated = admins.filter(a => a.id !== id);
      setAdmins(updated);
      saveToStorage(updated);
    }
  };

  const filtered = admins.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Administrators & Officials</h2>
          <p className="text-sm text-slate-500 mt-1">Manage school administrative staff, leadership roles, and direct contacts.</p>
        </div>
        {!editingAdmin && (
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Administrator
          </button>
        )}
      </div>

      {isSaved && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 border-b border-emerald-100">
          <Check className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}

      <div className="p-8">
        {editingAdmin ? (
          <form onSubmit={handleSaveAdmin} className="max-w-xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => setEditingAdmin(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Administrators List
            </button>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">S.N</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.sn}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, sn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Administrator Name</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  placeholder="e.g. Ganesh Kumar Dulal"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.phone}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                  placeholder="9852048927"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                  placeholder="e.g. Principal"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Administrator
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
                placeholder="Search administrators by name or role..."
                className="bg-transparent text-sm w-full outline-none text-slate-700"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-3 px-4 w-20">S.N</th>
                    <th className="py-3 px-4">Administrator Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700">{a.sn}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{a.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> {a.phone}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-emerald-700">{a.role}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingAdmin(a)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
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
