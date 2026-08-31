import React, { useState, useMemo } from 'react';
import {
  BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Printer,
  ChevronLeft, ChevronRight, X, Save, User, Phone, MapPin,
  Calendar, CreditCard, CheckCircle2, AlertTriangle, Download,
  Users, GraduationCap, School, Building2, Camera, Mail, Droplets
} from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS, BLOOD_GROUPS, GENDERS, STUDENT_STATUSES, ORG_INFO } from '../config/orgConfig';

// =============================================
// STUDENT DATA SERVICE (localStorage — swap with API later)
// =============================================
const STORAGE_KEY = 'multi_org_students';

const loadStudents = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const generateStudentId = (wing) => {
  const prefix = wing === 'School' ? 'SCH' : wing === 'Plus2' ? 'P2' : 'BACH';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}-2081-${timestamp}${random}`;
};

// =============================================
// STYLE CONSTANTS
// =============================================
const inputCls = "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";
const selectCls = "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all";

// =============================================
// WING ICON / COLOR MAP
// =============================================
const wingConfig = {
  School: { icon: School, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', activeBg: 'bg-emerald-600', activeRing: 'ring-emerald-200' },
  Plus2: { icon: BookOpen, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', activeBg: 'bg-blue-600', activeRing: 'ring-blue-200' },
  Bachelors: { icon: GraduationCap, color: 'violet', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', activeBg: 'bg-violet-600', activeRing: 'ring-violet-200' },
};

// =============================================
// MAIN COMPONENT
// =============================================
export default function StudentManagement() {
  // Filter state
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState(() => loadStudents());
  const [editingStudent, setEditingStudent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Available programs based on selected wing
  const availablePrograms = selectedWing ? (PROGRAMS[selectedWing] || []) : [];
  const availableLevels = selectedProgram ? (LEVELS[selectedProgram] || []) : [];

  // Reset cascading filters
  const handleWingChange = (wing) => {
    setSelectedWing(wing);
    setSelectedProgram('');
    setSelectedLevel('');
    setCurrentPage(1);
  };

  const handleProgramChange = (prog) => {
    setSelectedProgram(prog);
    setSelectedLevel('');
    setCurrentPage(1);
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedWing && s.wing !== selectedWing) return false;
      if (selectedProgram && s.programId !== selectedProgram) return false;
      if (selectedLevel && s.level !== selectedLevel) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.guardian.toLowerCase().includes(q);
      }
      return true;
    });
  }, [students, selectedWing, selectedProgram, selectedLevel, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / perPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Stats
  const stats = useMemo(() => {
    const base = selectedWing ? students.filter(s => s.wing === selectedWing) : students;
    return {
      total: base.length,
      active: base.filter(s => s.status === 'Active').length,
      passedOut: base.filter(s => s.status === 'Passed Out').length,
      dropped: base.filter(s => s.status === 'Dropped').length,
    };
  }, [students, selectedWing]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Helper: update state and persist to localStorage
  const updateAndSave = (updater) => {
    setStudents(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      saveStudents(updated);
      return updated;
    });
  };

  // Delete student
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      updateAndSave(prev => prev.filter(s => s.id !== id));
      setSelectedStudents(prev => prev.filter(x => x !== id));
    }
  };

  // Save student (add / edit)
  const handleSaveStudent = (studentData) => {
    if (editingStudent) {
      updateAndSave(prev => prev.map(s => s.id === editingStudent.id ? { ...studentData, id: editingStudent.id } : s));
    } else {
      const newId = generateStudentId(studentData.wing);
      updateAndSave(prev => [...prev, { ...studentData, id: newId }]);
    }
    setShowAddModal(false);
    setEditingStudent(null);
  };

  // Print handlers
  const handlePrintSelected = () => {
    if (selectedStudents.length === 0) return;
    setShowPrintPreview(true);
  };

  const getProgramName = (programId) => {
    for (const wing of WINGS) {
      const found = PROGRAMS[wing]?.find(p => p.id === programId);
      if (found) return found.name;
    }
    return programId;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Student Management</h3>
          <p className="text-slate-500 mt-1">Manage student records across all wings and programs.</p>
        </div>
        <button
          onClick={() => { setEditingStudent(null); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Wing Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* All Students */}
        <button
          onClick={() => handleWingChange('')}
          className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
            !selectedWing
              ? 'border-slate-800 bg-slate-800 text-white shadow-lg shadow-slate-800/20'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${!selectedWing ? 'bg-white/20' : 'bg-slate-100'}`}>
            <Users className={`w-5 h-5 ${!selectedWing ? 'text-white' : 'text-slate-600'}`} />
          </div>
          <div className={`font-bold text-lg ${!selectedWing ? '' : 'text-slate-800'}`}>All Students</div>
          <div className={`text-2xl font-extrabold mt-1 ${!selectedWing ? 'text-blue-300' : 'text-slate-800'}`}>{stats.total}</div>
        </button>

        {WINGS.map(wing => {
          const cfg = wingConfig[wing];
          const Icon = cfg.icon;
          const count = students.filter(s => s.wing === wing).length;
          const isActive = selectedWing === wing;
          return (
            <button
              key={wing}
              onClick={() => handleWingChange(wing)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                isActive
                  ? `${cfg.border} ${cfg.bg} shadow-lg`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${isActive ? cfg.badge : 'bg-slate-100'}`}>
                <Icon className={`w-5 h-5 ${isActive ? cfg.text : 'text-slate-600'}`} />
              </div>
              <div className={`font-bold text-lg ${isActive ? cfg.text : 'text-slate-800'}`}>{wing}</div>
              <div className={`text-2xl font-extrabold mt-1 ${isActive ? cfg.text : 'text-slate-800'}`}>{count}</div>
              {isActive && <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${cfg.activeBg} ring-4 ${cfg.activeRing}`} />}
            </button>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Program Filter */}
          {selectedWing && (
            <div className="flex-1 min-w-[180px]">
              <select
                value={selectedProgram}
                onChange={e => handleProgramChange(e.target.value)}
                className={selectCls}
              >
                <option value="">All Programs</option>
                {availablePrograms.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Level Filter */}
          {selectedProgram && (
            <div className="flex-1 min-w-[160px]">
              <select
                value={selectedLevel}
                onChange={e => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                className={selectCls}
              >
                <option value="">All {PROGRAMS[selectedWing]?.find(p => p.id === selectedProgram)?.type === 'semester' ? 'Semesters' : 'Classes'}</option>
                {availableLevels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex-1 min-w-[140px]">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={selectCls}
            >
              <option value="">All Status</option>
              {STUDENT_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-[2] min-w-[220px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or guardian..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Bulk Actions */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-500">{selectedStudents.length} selected</span>
              <button
                onClick={handlePrintSelected}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <Printer className="w-3.5 h-3.5" /> Print Cards
              </button>
              <button
                onClick={() => setSelectedStudents([])}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex items-center gap-6 px-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-slate-600 font-medium">Active: <strong className="text-slate-800">{stats.active}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 font-medium">Passed Out: <strong className="text-slate-800">{stats.passedOut}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-600 font-medium">Dropped: <strong className="text-slate-800">{stats.dropped}</strong></span>
        </div>
        <div className="ml-auto text-sm text-slate-500 font-medium">
          Showing <strong className="text-slate-700">{filteredStudents.length}</strong> students
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={paginatedStudents.length > 0 && selectedStudents.length === paginatedStudents.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Student</th>
                <th className="p-4">ID</th>
                <th className="p-4">Wing / Program</th>
                <th className="p-4">Level</th>
                <th className="p-4">Roll</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-semibold text-lg">No students found</p>
                      <p className="text-slate-400 text-sm">Try adjusting your filters or add a new student.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => {
                  const isSelected = selectedStudents.includes(student.id);
                  const wCfg = wingConfig[student.wing];
                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-[0.95rem]">{student.name}</div>
                            <div className="text-xs text-slate-400 font-medium">{student.guardian} • {student.guardianPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{student.id}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${wCfg?.badge || 'bg-slate-100 text-slate-700'}`}>
                          {student.wing}
                        </span>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{getProgramName(student.programId)}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 text-sm">{student.level}</td>
                      <td className="p-4">
                        <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-700">
                          {student.roll}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          student.status === 'Active' ? 'bg-green-100 text-green-700' :
                          student.status === 'Passed Out' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                          {student.status === 'Dropped' && <AlertTriangle className="w-3 h-3" />}
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelectedStudent(student); setShowDetailModal(true); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingStudent(student); setShowAddModal(true); }}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedStudents([student.id]); setShowPrintPreview(true); }}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Print ID Card"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-white border border-transparent hover:border-slate-200 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddStudentModal
          student={editingStudent}
          onClose={() => { setShowAddModal(false); setEditingStudent(null); }}
          onSave={handleSaveStudent}
        />
      )}

      {showDetailModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          getProgramName={getProgramName}
          onClose={() => { setShowDetailModal(false); setSelectedStudent(null); }}
          onEdit={() => { setShowDetailModal(false); setEditingStudent(selectedStudent); setShowAddModal(true); }}
          onPrint={() => { setShowDetailModal(false); setSelectedStudents([selectedStudent.id]); setShowPrintPreview(true); }}
        />
      )}

      {showPrintPreview && (
        <PrintPreviewModal
          students={students.filter(s => selectedStudents.includes(s.id))}
          getProgramName={getProgramName}
          onClose={() => { setShowPrintPreview(false); setSelectedStudents([]); }}
        />
      )}
    </div>
  );
}

// =============================================
// ADD / EDIT STUDENT MODAL
// =============================================
function AddStudentModal({ student, onClose, onSave }) {
  const isEdit = !!student;
  const [form, setForm] = useState(student || {
    name: '', photo: null, dob: '', gender: '', guardian: '', guardianPhone: '',
    address: '', bloodGroup: '', wing: '', programId: '', level: '', roll: '',
    admissionDate: '', status: 'Active', email: '',
  });

  const programs = form.wing ? (PROGRAMS[form.wing] || []) : [];
  const levels = form.programId ? (LEVELS[form.programId] || []) : [];

  const updateField = (field, value) => {
    const updated = { ...form, [field]: value };
    if (field === 'wing') { updated.programId = ''; updated.level = ''; }
    if (field === 'programId') { updated.level = ''; }
    setForm(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.wing || !form.programId || !form.level) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Student' : 'Add New Student'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the student details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Photo */}
            <div className="col-span-2 flex items-center gap-4 mb-2">
              <div className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Photo</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Student Photo</p>
                <p className="text-xs text-slate-500">For ID card. Passport size recommended.</p>
              </div>
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className={labelCls}>Full Name *</label>
              <input type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className={inputCls} placeholder="Enter student's full name" required />
            </div>

            {/* Wing */}
            <div>
              <label className={labelCls}>Wing *</label>
              <select value={form.wing} onChange={e => updateField('wing', e.target.value)} className={selectCls} required>
                <option value="">Select Wing</option>
                {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Program */}
            <div>
              <label className={labelCls}>Program *</label>
              <select value={form.programId} onChange={e => updateField('programId', e.target.value)} className={selectCls} required disabled={!form.wing}>
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className={labelCls}>Level / Class *</label>
              <select value={form.level} onChange={e => updateField('level', e.target.value)} className={selectCls} required disabled={!form.programId}>
                <option value="">Select Level</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Roll */}
            <div>
              <label className={labelCls}>Roll Number</label>
              <input type="number" value={form.roll} onChange={e => updateField('roll', parseInt(e.target.value) || '')} className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="Roll no." />
            </div>

            {/* DOB */}
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="text" value={form.dob} onChange={e => updateField('dob', e.target.value)} className={inputCls} placeholder="e.g. 2063-05-12" />
            </div>

            {/* Gender */}
            <div>
              <label className={labelCls}>Gender</label>
              <select value={form.gender} onChange={e => updateField('gender', e.target.value)} className={selectCls}>
                <option value="">Select Gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Guardian */}
            <div>
              <label className={labelCls}>Guardian Name</label>
              <input type="text" value={form.guardian} onChange={e => updateField('guardian', e.target.value)} className={inputCls} placeholder="Guardian's name" />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className={labelCls}>Guardian Phone</label>
              <input type="number" value={form.guardianPhone} onChange={e => updateField('guardianPhone', e.target.value)} className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="98XXXXXXXX" />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className={labelCls}>Address</label>
              <input type="text" value={form.address} onChange={e => updateField('address', e.target.value)} className={inputCls} placeholder="Full address" />
            </div>

            {/* Blood Group */}
            <div>
              <label className={labelCls}>Blood Group</label>
              <select value={form.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputCls} placeholder="email@example.com" />
            </div>

            {/* Admission Date */}
            <div>
              <label className={labelCls}>Admission Date</label>
              <input type="text" value={form.admissionDate} onChange={e => updateField('admissionDate', e.target.value)} className={inputCls} placeholder="e.g. 2080-01-15" />
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => updateField('status', e.target.value)} className={selectCls}>
                {STUDENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-blue-600/20">
              <Save className="w-4 h-4" /> {isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================
// STUDENT DETAIL MODAL
// =============================================
function StudentDetailModal({ student, getProgramName, onClose, onEdit, onPrint }) {
  const wCfg = wingConfig[student.wing];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header with gradient */}
        <div className={`p-6 rounded-t-2xl ${wCfg?.bg || 'bg-slate-50'} border-b ${wCfg?.border || 'border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-200">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
                <p className="text-sm font-mono font-semibold text-slate-500 mt-0.5">{student.id}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mt-1 ${wCfg?.badge || 'bg-slate-100 text-slate-700'}`}>
                  {student.wing} • {getProgramName(student.programId)}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          {[
            { icon: GraduationCap, label: 'Level', value: student.level },
            { icon: User, label: 'Roll No', value: student.roll },
            { icon: Calendar, label: 'Date of Birth', value: student.dob || '—' },
            { icon: User, label: 'Gender', value: student.gender || '—' },
            { icon: Users, label: 'Guardian', value: student.guardian || '—' },
            { icon: Phone, label: 'Guardian Phone', value: student.guardianPhone || '—' },
            { icon: MapPin, label: 'Address', value: student.address || '—' },
            { icon: Droplets, label: 'Blood Group', value: student.bloodGroup || '—' },
            { icon: Mail, label: 'Email', value: student.email || '—' },
            { icon: Calendar, label: 'Admission Date', value: student.admissionDate || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-1.5">
              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-500 font-medium w-32 shrink-0">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{value}</span>
            </div>
          ))}

          <div className="flex items-center gap-3 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500 font-medium w-32 shrink-0">Status</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              student.status === 'Active' ? 'bg-green-100 text-green-700' :
              student.status === 'Passed Out' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>{student.status}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors">
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={onPrint} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print Card
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// PRINT PREVIEW MODAL (ID CARDS)
// =============================================
function PrintPreviewModal({ students, getProgramName, onClose }) {
  const handlePrint = () => {
    const printContents = document.getElementById('print-area');
    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Cards</title>
          <style>
            @page { size: A4; margin: 10mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; }
            .cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
            .card-wrapper { page-break-inside: avoid; }
            .id-card { width: 324px; height: 204px; border: 2px solid #1e40af; border-radius: 12px; overflow: hidden; background: white; font-size: 11px; }
            .card-header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 8px 12px; display: flex; align-items: center; gap: 8px; }
            .card-header .logo-circle { width: 28px; height: 28px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; }
            .card-header .org-info { flex: 1; }
            .card-header .org-name { font-weight: 800; font-size: 12px; letter-spacing: 0.5px; }
            .card-header .org-addr { font-size: 9px; opacity: 0.85; }
            .card-body { padding: 10px 12px; display: flex; gap: 10px; }
            .photo-box { width: 64px; height: 76px; border: 2px solid #e2e8f0; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 24px; font-weight: bold; flex-shrink: 0; }
            .info-block { flex: 1; display: flex; flex-direction: column; gap: 3px; }
            .info-row { display: flex; }
            .info-label { width: 60px; color: #64748b; font-size: 10px; font-weight: 600; }
            .info-value { flex: 1; color: #1e293b; font-weight: 700; font-size: 10px; }
            .card-footer { background: #f1f5f9; padding: 5px 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; }
            .card-footer .student-id { font-family: monospace; font-weight: 800; color: #1e40af; font-size: 10px; }
            .card-footer .validity { font-size: 9px; color: #64748b; font-weight: 600; }
            .wing-badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-top: 2px; }
            .wing-School { background: #d1fae5; color: #065f46; }
            .wing-Plus2 { background: #dbeafe; color: #1e40af; }
            .wing-Bachelors { background: #ede9fe; color: #5b21b6; }

            .id-card-back { width: 324px; height: 204px; border: 2px solid #1e40af; border-radius: 12px; overflow: hidden; background: white; font-size: 11px; display: flex; flex-direction: column; }
            .back-header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 6px 12px; text-align: center; font-weight: 700; font-size: 11px; }
            .back-body { padding: 10px 14px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
            .back-row { display: flex; }
            .back-label { width: 80px; color: #64748b; font-size: 10px; font-weight: 600; }
            .back-value { flex: 1; color: #1e293b; font-weight: 700; font-size: 10px; }
            .back-footer { padding: 6px 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-line { border-top: 1px solid #334155; padding-top: 2px; text-align: center; font-size: 9px; color: #64748b; font-weight: 600; width: 100px; }
            .return-notice { background: #f1f5f9; padding: 6px 14px; text-align: center; font-size: 8px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          ${printContents.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-800">🪪 ID Card Preview</h3>
            <p className="text-sm text-slate-500">{students.length} card{students.length > 1 ? 's' : ''} ready to print</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Printer className="w-4 h-4" /> Print All
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-6" id="print-area">
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {students.map(student => (
              <div key={student.id} className="card-wrapper" style={{ pageBreakInside: 'avoid' }}>
                {/* FRONT */}
                <IDCardFront student={student} getProgramName={getProgramName} />
                {/* BACK */}
                <div style={{ marginTop: '8px' }}>
                  <IDCardBack student={student} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// ID CARD FRONT
// =============================================
function IDCardFront({ student, getProgramName }) {
  return (
    <div style={{
      width: '324px', height: '204px', border: '2px solid #1e40af', borderRadius: '12px',
      overflow: 'hidden', background: 'white', fontSize: '11px', fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white',
        padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{
          width: '28px', height: '28px', background: 'rgba(255,255,255,0.25)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '12px'
        }}>
          {ORG_INFO.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '0.5px' }}>{ORG_INFO.name}</div>
          <div style={{ fontSize: '9px', opacity: 0.85 }}>{ORG_INFO.address}</div>
        </div>
        <div style={{
          padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
          background: student.wing === 'School' ? 'rgba(16,185,129,0.3)' :
                      student.wing === 'Plus2' ? 'rgba(96,165,250,0.3)' : 'rgba(167,139,250,0.3)'
        }}>
          {student.wing}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px', display: 'flex', gap: '10px' }}>
        <div style={{
          width: '64px', height: '76px', border: '2px solid #e2e8f0', borderRadius: '8px',
          background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8', fontSize: '20px', fontWeight: 'bold', flexShrink: 0
        }}>
          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {[
            { l: 'Name', v: student.name },
            { l: 'Program', v: getProgramName(student.programId) },
            { l: 'Level', v: student.level },
            { l: 'Roll No', v: student.roll },
            { l: 'DOB', v: student.dob || '—' },
          ].map(({ l, v }) => (
            <div key={l} style={{ display: 'flex' }}>
              <span style={{ width: '60px', color: '#64748b', fontSize: '10px', fontWeight: 600 }}>{l}:</span>
              <span style={{ flex: 1, color: '#1e293b', fontWeight: 700, fontSize: '10px' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#f1f5f9', padding: '5px 12px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0'
      }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1e40af', fontSize: '10px' }}>{student.id}</span>
        <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>Valid: {ORG_INFO.currentSession}</span>
      </div>
    </div>
  );
}

// =============================================
// ID CARD BACK
// =============================================
function IDCardBack({ student }) {
  return (
    <div style={{
      width: '324px', height: '204px', border: '2px solid #1e40af', borderRadius: '12px',
      overflow: 'hidden', background: 'white', fontSize: '11px', fontFamily: "'Segoe UI', Arial, sans-serif",
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white',
        padding: '6px 12px', textAlign: 'center', fontWeight: 700, fontSize: '11px'
      }}>
        STUDENT IDENTITY CARD
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          { l: 'Guardian', v: student.guardian || '—' },
          { l: 'Phone', v: student.guardianPhone || '—' },
          { l: 'Blood Group', v: student.bloodGroup || '—' },
          { l: 'Address', v: student.address || '—' },
          { l: 'Admission', v: student.admissionDate || '—' },
        ].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex' }}>
            <span style={{ width: '80px', color: '#64748b', fontSize: '10px', fontWeight: 600 }}>{l}:</span>
            <span style={{ flex: 1, color: '#1e293b', fontWeight: 700, fontSize: '10px' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Signature */}
      <div style={{
        padding: '6px 14px', borderTop: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
      }}>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '2px', textAlign: 'center', fontSize: '9px', color: '#64748b', fontWeight: 600, width: '100px' }}>
          Student's Sign
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '2px', textAlign: 'center', fontSize: '9px', color: '#64748b', fontWeight: 600, width: '100px' }}>
          Principal's Sign
        </div>
      </div>

      {/* Return Notice */}
      <div style={{
        background: '#f1f5f9', padding: '5px 14px', textAlign: 'center',
        fontSize: '8px', color: '#64748b', borderTop: '1px solid #e2e8f0'
      }}>
        If found, please return to: {ORG_INFO.name}, {ORG_INFO.address} | Ph: {ORG_INFO.phone}
      </div>
    </div>
  );
}
