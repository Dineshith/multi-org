import React, { useState, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import {
  BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Printer,
  ChevronLeft, ChevronRight, X, Save, User, Phone, MapPin,
  Calendar, CreditCard, CheckCircle2, AlertTriangle, Download,
  Users, GraduationCap, School, Building2, Camera, Mail, Droplets,
  Upload, FileSpreadsheet, Check, AlertCircle, ArrowLeft, ArrowRight, Info
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
  const [showImportModal, setShowImportModal] = useState(false);
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={() => { setEditingStudent(null); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
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

      {showImportModal && (
        <ImportCSVModal
          existingStudents={students}
          onClose={() => setShowImportModal(false)}
          onImport={(newStudents) => {
            const withIds = newStudents.map(s => ({ ...s, id: generateStudentId(s.wing) }));
            updateAndSave(prev => [...prev, ...withIds]);
            setShowImportModal(false);
          }}
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

// =============================================
// IMPORT CSV MODAL (Multi-Step Wizard)
// =============================================
function ImportCSVModal({ onClose, onImport, existingStudents = [] }) {
  const [step, setStep] = useState(1); // 1 = download/upload, 2 = preview & validate
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ---- Pre-selected class context (teacher's class) ----
  const [templateWing, setTemplateWing] = useState('');
  const [templateProgram, setTemplateProgram] = useState('');
  const [templateLevel, setTemplateLevel] = useState('');

  const tAvailablePrograms = templateWing ? (PROGRAMS[templateWing] || []) : [];
  const tAvailableLevels = templateProgram ? (LEVELS[templateProgram] || []) : [];
  const isClassSelected = templateWing && templateProgram && templateLevel;

  const handleTemplateWingChange = (wing) => {
    setTemplateWing(wing);
    setTemplateProgram('');
    setTemplateLevel('');
  };
  const handleTemplateProgramChange = (prog) => {
    setTemplateProgram(prog);
    setTemplateLevel('');
  };

  // ---- CSV Column Mapping (excludes Wing/Program/Level — those are pre-selected) ----
  const CSV_COLUMNS = [
    { csv: 'Full Name', key: 'name', required: true },
    { csv: 'Roll Number', key: 'roll', required: false },
    { csv: 'Date of Birth', key: 'dob', required: false },
    { csv: 'Gender', key: 'gender', required: false },
    { csv: 'Guardian Name', key: 'guardian', required: false },
    { csv: 'Guardian Phone', key: 'guardianPhone', required: false },
    { csv: 'Address', key: 'address', required: false },
    { csv: 'Blood Group', key: 'bloodGroup', required: false },
    { csv: 'Email', key: 'email', required: false },
    { csv: 'Admission Date', key: 'admissionDate', required: false },
    { csv: 'Status', key: 'status', required: false },
  ];

  // ---- Download Template ----
  const downloadTemplate = () => {
    if (!isClassSelected) return;
    const headers = CSV_COLUMNS.map(c => c.csv);
    // One example row for reference
    const exampleRow = [
      'Ram Bahadur', '1',
      '2063-05-12', 'Male', 'Hari Bahadur', '9841234567',
      'Kathmandu', 'B+', 'ram@email.com', '2080-01-15', 'Active',
    ];
    const programName = tAvailablePrograms.find(p => p.id === templateProgram)?.name || templateProgram;
    const csvContent = [
      `# Template for: ${templateWing} > ${programName} > ${templateLevel}`,
      headers.join(','),
      exampleRow.join(','),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${templateWing}_${templateLevel.replace(/\s+/g, '_')}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- Validate a single row (Wing/Program/Level are auto-injected, no need to validate) ----
  const validateRow = (row, index) => {
    const rowErrors = [];
    // Required field
    if (!row.name || !row.name.trim()) rowErrors.push(`Row ${index + 1}: Full Name is required.`);
    // Enum validations
    if (row.gender && !GENDERS.includes(row.gender)) rowErrors.push(`Row ${index + 1}: Gender must be one of: ${GENDERS.join(', ')}.`);
    if (row.status && !STUDENT_STATUSES.includes(row.status)) rowErrors.push(`Row ${index + 1}: Status must be one of: ${STUDENT_STATUSES.join(', ')}.`);
    if (row.bloodGroup && !BLOOD_GROUPS.includes(row.bloodGroup)) rowErrors.push(`Row ${index + 1}: Blood Group must be one of: ${BLOOD_GROUPS.join(', ')}.`);
    // Phone number validation
    if (row.guardianPhone && !/^\d{7,15}$/.test(row.guardianPhone)) {
      rowErrors.push(`Row ${index + 1}: Guardian Phone "${row.guardianPhone}" is not a valid phone number.`);
    }
    // Email validation
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      rowErrors.push(`Row ${index + 1}: Email "${row.email}" is not a valid email address.`);
    }
    return rowErrors;
  };

  // ---- Parse uploaded file ----
  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a .csv file.']);
      return;
    }
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      comments: '#',
      complete: (results) => {
        const mapped = results.data.map(row => {
          const student = {
            // Auto-inject the pre-selected class context
            wing: templateWing,
            programId: templateProgram,
            level: templateLevel,
          };
          CSV_COLUMNS.forEach(col => {
            student[col.key] = (row[col.csv] || '').trim();
          });
          // Default status to Active if empty
          if (!student.status) student.status = 'Active';
          // Parse roll to number
          if (student.roll) student.roll = parseInt(student.roll) || '';
          return student;
        });

        // ---- Per-row field validation ----
        const allErrors = [];
        mapped.forEach((row, i) => {
          const rowErrs = validateRow(row, i);
          allErrors.push(...rowErrs);
        });

        // ---- Duplicate detection within the CSV itself ----
        const csvRollsSeen = new Map(); // roll -> first row index
        const csvNamesSeen = new Map(); // lowercase name -> first row index
        mapped.forEach((row, i) => {
          // Duplicate roll within CSV (only if roll is provided)
          if (row.roll) {
            const rollKey = String(row.roll);
            if (csvRollsSeen.has(rollKey)) {
              allErrors.push(`Row ${i + 1}: Duplicate Roll Number "${row.roll}" — same as Row ${csvRollsSeen.get(rollKey) + 1} in this file.`);
            } else {
              csvRollsSeen.set(rollKey, i);
            }
          }
          // Duplicate name within CSV
          if (row.name) {
            const nameKey = row.name.toLowerCase().trim();
            if (csvNamesSeen.has(nameKey)) {
              allErrors.push(`Row ${i + 1}: Duplicate Name "${row.name}" — same as Row ${csvNamesSeen.get(nameKey) + 1} in this file.`);
            } else {
              csvNamesSeen.set(nameKey, i);
            }
          }
        });

        // ---- Duplicate detection against existing students in the same class ----
        const existingInClass = existingStudents.filter(
          s => s.wing === templateWing && s.programId === templateProgram && s.level === templateLevel
        );
        const existingRolls = new Set(existingInClass.map(s => String(s.roll)).filter(Boolean));
        const existingNames = new Set(existingInClass.map(s => s.name?.toLowerCase().trim()).filter(Boolean));

        mapped.forEach((row, i) => {
          // Roll already exists in database
          if (row.roll && existingRolls.has(String(row.roll))) {
            allErrors.push(`Row ${i + 1}: Roll Number "${row.roll}" already exists in ${templateWing} > ${templateLevel}.`);
          }
          // Name already exists in database
          if (row.name && existingNames.has(row.name.toLowerCase().trim())) {
            allErrors.push(`Row ${i + 1}: Student "${row.name}" already exists in ${templateWing} > ${templateLevel}.`);
          }
        });

        setParsedData(mapped);
        setErrors(allErrors);
        setStep(2);
      },
      error: (err) => {
        setErrors([`Failed to parse CSV: ${err.message}`]);
      },
    });
  };

  // ---- Drag & Drop ----
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  // ---- Get rows categorized (derive from the errors state which includes both field + duplicate errors) ----
  const invalidRowIndices = useMemo(() => {
    const indices = new Set();
    errors.forEach(err => {
      const match = err.match(/^Row (\d+):/);
      if (match) indices.add(parseInt(match[1]) - 1); // convert to 0-indexed
    });
    return indices;
  }, [errors]);
  const validRows = parsedData.filter((_, i) => !invalidRowIndices.has(i));

  const getProgramName = (programId) => {
    for (const wing of WINGS) {
      const found = PROGRAMS[wing]?.find(p => p.id === programId);
      if (found) return found.name;
    }
    return programId;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Import Students from CSV</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {step === 1 && 'Download the template, fill it out, and upload it here.'}
                {step === 2 && `Preview — ${parsedData.length} row${parsedData.length !== 1 ? 's' : ''} found in ${fileName}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-3 shrink-0">
          {[{ n: 1, label: 'Upload' }, { n: 2, label: 'Preview & Validate' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= n ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > n ? <Check className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-sm font-semibold ${step >= n ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
              {n < 2 && <div className={`w-12 h-0.5 rounded ${step > n ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ===== STEP 1: Select Class + Download & Upload ===== */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-bold">How to use:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>Select the <strong>Wing, Program, and Class/Level</strong> below.</li>
                      <li>Download the CSV template for that class.</li>
                      <li>Open it in Excel or Google Sheets and fill in the student data.</li>
                      <li><strong>Do not change the column headers.</strong></li>
                      <li>Save/Export as <code className="bg-blue-100 px-1 py-0.5 rounded text-xs font-mono">.csv</code> format and upload it here.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Class Selector */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-5">
                <h4 className="font-bold text-slate-800 mb-1">Select Class</h4>
                <p className="text-sm text-slate-500 mb-4">Choose the Wing, Program, and Level. All imported students will be assigned to this class.</p>

                <div className="grid grid-cols-3 gap-3">
                  {/* Wing */}
                  <div>
                    <label className={labelCls}>Wing *</label>
                    <select
                      value={templateWing}
                      onChange={e => handleTemplateWingChange(e.target.value)}
                      className={selectCls}
                    >
                      <option value="">Select Wing</option>
                      {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>

                  {/* Program */}
                  <div>
                    <label className={labelCls}>Program *</label>
                    <select
                      value={templateProgram}
                      onChange={e => handleTemplateProgramChange(e.target.value)}
                      className={selectCls}
                      disabled={!templateWing}
                    >
                      <option value="">Select Program</option>
                      {tAvailablePrograms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className={labelCls}>Level / Class *</label>
                    <select
                      value={templateLevel}
                      onChange={e => setTemplateLevel(e.target.value)}
                      className={selectCls}
                      disabled={!templateProgram}
                    >
                      <option value="">Select Level</option>
                      {tAvailableLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Selected class badge */}
                {isClassSelected && (
                  <div className="mt-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Class selected:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${wingConfig[templateWing]?.badge || 'bg-slate-100 text-slate-600'}`}>{templateWing}</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-sm font-semibold text-slate-700">{tAvailablePrograms.find(p => p.id === templateProgram)?.name}</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-sm font-semibold text-slate-700">{templateLevel}</span>
                  </div>
                )}
              </div>

              {/* Template Download */}
              <div className={`bg-slate-50 border border-slate-200 rounded-xl p-5 transition-opacity ${isClassSelected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">Download Template</h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {isClassSelected
                        ? `Template for ${templateWing} › ${tAvailablePrograms.find(p => p.id === templateProgram)?.name} › ${templateLevel}`
                        : 'Select a class above to download the template.'
                      }
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    disabled={!isClassSelected}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" /> Download .csv
                  </button>
                </div>

                {/* Column Reference Table */}
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2.5 font-bold text-slate-600 uppercase tracking-wider">Column Name</th>
                        <th className="p-2.5 font-bold text-slate-600 uppercase tracking-wider">Required</th>
                        <th className="p-2.5 font-bold text-slate-600 uppercase tracking-wider">Accepted Values</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { col: 'Full Name', req: true, vals: 'Any text' },
                        { col: 'Roll Number', req: false, vals: 'Number' },
                        { col: 'Gender', req: false, vals: GENDERS.join(', ') },
                        { col: 'Guardian Name', req: false, vals: 'Any text' },
                        { col: 'Guardian Phone', req: false, vals: 'Phone number' },
                        { col: 'Status', req: false, vals: STUDENT_STATUSES.join(', ') + ' (default: Active)' },
                        { col: 'Blood Group', req: false, vals: BLOOD_GROUPS.join(', ') },
                      ].map(({ col, req, vals }) => (
                        <tr key={col} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-700">{col}</td>
                          <td className="p-2.5">
                            {req
                              ? <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">Required</span>
                              : <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">Optional</span>
                            }
                          </td>
                          <td className="p-2.5 text-slate-500 font-medium">{vals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={isClassSelected ? handleDragOver : undefined}
                onDragLeave={isClassSelected ? handleDragLeave : undefined}
                onDrop={isClassSelected ? handleDrop : undefined}
                onClick={isClassSelected ? () => fileInputRef.current?.click() : undefined}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  !isClassSelected
                    ? 'border-slate-200 bg-slate-50/50 opacity-40 cursor-not-allowed'
                    : isDragging
                      ? 'border-emerald-400 bg-emerald-50 scale-[1.01] cursor-pointer'
                      : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isDragging ? 'bg-emerald-200' : 'bg-slate-100'
                }`}>
                  <Upload className={`w-7 h-7 ${isDragging ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <p className="text-slate-700 font-bold text-lg">
                  {isClassSelected ? 'Drag & drop your CSV file here' : 'Select a class first to upload'}
                </p>
                {isClassSelected && (
                  <p className="text-slate-400 text-sm mt-1">or <span className="text-emerald-600 font-semibold underline">click to browse</span></p>
                )}

                {errors.length > 0 && step === 1 && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                    {errors.map((e, i) => (
                      <p key={i} className="text-red-600 text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {e}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== STEP 2: Preview & Validate ===== */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Pre-selected class badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Importing to:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${wingConfig[templateWing]?.badge || 'bg-slate-100 text-slate-600'}`}>{templateWing}</span>
                <span className="text-slate-400">›</span>
                <span className="text-sm font-semibold text-slate-700">{getProgramName(templateProgram)}</span>
                <span className="text-slate-400">›</span>
                <span className="text-sm font-semibold text-slate-700">{templateLevel}</span>
              </div>

              {/* Summary Bar */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{validRows.length} valid</span>
                </div>
                {invalidRowIndices.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-red-700">{invalidRowIndices.size} with errors</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-auto">Rows with errors will be <strong>skipped</strong> during import.</span>
              </div>

              {/* Error details */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Validation Errors
                  </p>
                  <div className="space-y-1">
                    {errors.map((e, i) => (
                      <p key={i} className="text-xs text-red-600 font-medium">• {e}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-3 w-8">#</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Roll</th>
                        <th className="p-3">Gender</th>
                        <th className="p-3">DOB</th>
                        <th className="p-3">Guardian</th>
                        <th className="p-3">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.map((row, i) => {
                        const isInvalid = invalidRowIndices.has(i);
                        return (
                          <tr key={i} className={isInvalid ? 'bg-red-50/60' : 'hover:bg-slate-50'}>
                            <td className="p-3 font-mono text-slate-400">{i + 1}</td>
                            <td className="p-3">
                              {isInvalid
                                ? <span className="flex items-center gap-1 text-red-600 font-bold"><AlertCircle className="w-3 h-3" /> Error</span>
                                : <span className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-3 h-3" /> OK</span>
                              }
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{row.name || '—'}</td>
                            <td className="p-3 text-slate-600 font-medium">{row.roll || '—'}</td>
                            <td className="p-3 text-slate-600 font-medium">{row.gender || '—'}</td>
                            <td className="p-3 text-slate-600 font-medium">{row.dob || '—'}</td>
                            <td className="p-3 text-slate-600 font-medium">{row.guardian || '—'}</td>
                            <td className="p-3 text-slate-600 font-medium">{row.guardianPhone || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50 shrink-0">
          {step === 2 ? (
            <>
              <button
                onClick={() => { setStep(1); setParsedData([]); setErrors([]); setFileName(''); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => onImport(validRows)}
                  disabled={validRows.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" /> Import {validRows.length} Student{validRows.length !== 1 ? 's' : ''}
                </button>
              </div>
            </>
          ) : (
            <>
              <div />
              <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
