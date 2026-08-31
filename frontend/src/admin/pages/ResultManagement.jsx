import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck, FileSpreadsheet, Printer, Plus, Save,
  FileText, CheckCircle2, X, ChevronRight, Users, Award,
  AlertTriangle, UserPlus, BookOpen, Trash2
} from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS, TERMINALS } from '../config/orgConfig';


const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";

// =============================================
// MAIN COMPONENT
// =============================================
export default function ResultManagement() {
  const [activeTab, setActiveTab] = useState('students');

  // ----------- GLOBAL DYNAMIC STATE -----------

  // Students: { [key: programId__level]: [ {id, name, symbol}, ... ] }
  const [studentsMap, setStudentsMap] = useState({});

  // Subjects: { [key: programId__level]: [ {id, name, fullMarks, passMarks}, ... ] }
  const [subjectsMap, setSubjectsMap] = useState({});

  // Exams: [ { id, name, terminal, wing, programId, level, status } ]
  const [exams, setExams] = useState([]);

  // Marks: { [examId]: { [studentId]: { [subjectId]: number|'' } } }
  const [marksStore, setMarksStore] = useState({});

  const tabs = [
    { id: 'students', label: 'Students', icon: UserPlus },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'exams', label: 'Exam Setup', icon: FileText },
    { id: 'entry', label: 'Marks Entry', icon: FileSpreadsheet },
    { id: 'results', label: 'View Results', icon: Award },
    { id: 'publish', label: 'Publish', icon: Printer },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Result & Examination</h3>
        <p className="text-slate-500 mt-1">Add students, set subjects, enter marks, and generate results per faculty.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm whitespace-nowrap ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[650px]">
        {activeTab === 'students' && <StudentsTab studentsMap={studentsMap} setStudentsMap={setStudentsMap} />}
        {activeTab === 'subjects' && <SubjectsTab subjectsMap={subjectsMap} setSubjectsMap={setSubjectsMap} />}
        {activeTab === 'exams' && <ExamSetupTab exams={exams} setExams={setExams} setActiveTab={setActiveTab} />}
        {activeTab === 'entry' && <MarksEntryTab exams={exams} studentsMap={studentsMap} subjectsMap={subjectsMap} marksStore={marksStore} setMarksStore={setMarksStore} setActiveTab={setActiveTab} />}
        {activeTab === 'results' && <ViewResultsTab exams={exams} studentsMap={studentsMap} subjectsMap={subjectsMap} marksStore={marksStore} />}
        {activeTab === 'publish' && <PublishTab exams={exams} setExams={setExams} studentsMap={studentsMap} marksStore={marksStore} />}
      </div>
    </div>
  );
}

// =============================================
// Filter Bar (Reusable: Wing → Program → Level)
// =============================================
function FilterBar({ filter, setFilter, showTerminal = false }) {
  const programs = PROGRAMS[filter.wing] || [];
  const levels = filter.programId ? (LEVELS[filter.programId] || []) : [];
  const progType = programs.find(p => p.id === filter.programId)?.type;

  return (
    <div className={`grid grid-cols-1 ${showTerminal ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl`}>
      <div>
        <label className={labelCls}>Wing</label>
        <select value={filter.wing} onChange={e => setFilter({ ...filter, wing: e.target.value, programId: '', level: '' })} className={inputCls}>
          {WINGS.map(w => <option key={w}>{w}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Program / Faculty</label>
        <select value={filter.programId} onChange={e => setFilter({ ...filter, programId: e.target.value, level: '' })} className={inputCls}>
          <option value="">-- Select --</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>{progType === 'semester' ? 'Semester' : 'Year / Class'}</label>
        <select value={filter.level} onChange={e => setFilter({ ...filter, level: e.target.value })} className={inputCls} disabled={!filter.programId}>
          <option value="">-- Select --</option>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      {showTerminal && (
        <div>
          <label className={labelCls}>Terminal</label>
          <select value={filter.terminal || ''} onChange={e => setFilter({ ...filter, terminal: e.target.value })} className={inputCls}>
            <option value="">-- Select --</option>
            {TERMINALS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

// =============================================
// 1. STUDENTS TAB (Admin adds students)
// =============================================
function StudentsTab({ studentsMap, setStudentsMap }) {
  const [filter, setFilter] = useState({ wing: 'Bachelors', programId: '', level: '' });
  const key = filter.programId && filter.level ? `${filter.programId}__${filter.level}` : '';
  const students = key ? (studentsMap[key] || []) : [];

  const [form, setForm] = useState({ name: '', symbol: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!key) return alert('Select Wing, Program & Level first.');
    if (!form.name || !form.symbol) return;

    const newStudent = { id: `STU-${Date.now()}`, name: form.name, symbol: form.symbol };
    setStudentsMap(prev => ({ ...prev, [key]: [...(prev[key] || []), newStudent] }));
    setForm({ name: '', symbol: '' });
  };

  const handleDelete = (studentId) => {
    if (!window.confirm('Remove this student?')) return;
    setStudentsMap(prev => ({ ...prev, [key]: (prev[key] || []).filter(s => s.id !== studentId) }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-800">
          <UserPlus className="w-5 h-5 inline mr-2 text-blue-600" />Manage Students
        </h4>
      </div>

      <FilterBar filter={filter} setFilter={setFilter} />

      {!key ? (
        <p className="text-center py-10 text-slate-400 font-medium">👆 Select Wing, Program & Level to manage students.</p>
      ) : (
        <>
          {/* Add Student Form */}
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          ) : (
            <form onSubmit={handleAdd} className="flex items-end gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
              <div className="flex-1">
                <label className={labelCls}>Student Full Name <span className="text-red-500">*</span></label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Sharma" className={inputCls} />
              </div>
              <div className="w-48">
                <label className={labelCls}>Symbol Number <span className="text-red-500">*</span></label>
                <input required type="text" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} placeholder="e.g. 12345" className={inputCls} />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors whitespace-nowrap">Add</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500 p-2"><X className="w-5 h-5" /></button>
            </form>
          )}

          {/* Student List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 w-16">#</th>
                  <th className="p-4 w-40">Symbol No.</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400">No students added yet for this class.</td></tr>
                ) : students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-400 font-semibold">{i + 1}</td>
                    <td className="p-4 font-bold text-blue-700">{s.symbol}</td>
                    <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total Students: <strong>{students.length}</strong></p>
        </>
      )}
    </div>
  )
}

// =============================================
// 2. SUBJECTS TAB (Admin sets subjects & full marks)
// =============================================
function SubjectsTab({ subjectsMap, setSubjectsMap }) {
  const [filter, setFilter] = useState({ wing: 'Bachelors', programId: '', level: '' });
  const key = filter.programId && filter.level ? `${filter.programId}__${filter.level}` : '';
  const subjects = key ? (subjectsMap[key] || []) : [];

  const [form, setForm] = useState({ name: '', fullMarks: '100', passMarks: '40' });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!key) return alert('Select Wing, Program & Level first.');
    if (!form.name || !form.fullMarks || !form.passMarks) return;

    const newSubject = {
      id: `SUB-${Date.now()}`,
      name: form.name,
      fullMarks: parseInt(form.fullMarks),
      passMarks: parseInt(form.passMarks)
    };
    setSubjectsMap(prev => ({ ...prev, [key]: [...(prev[key] || []), newSubject] }));
    setForm({ name: '', fullMarks: '100', passMarks: '40' });
  };

  const handleDelete = (subjectId) => {
    if (!window.confirm('Remove this subject?')) return;
    setSubjectsMap(prev => ({ ...prev, [key]: (prev[key] || []).filter(s => s.id !== subjectId) }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-800">
          <BookOpen className="w-5 h-5 inline mr-2 text-blue-600" />Manage Subjects & Full Marks
        </h4>
      </div>

      <FilterBar filter={filter} setFilter={setFilter} />

      {!key ? (
        <p className="text-center py-10 text-slate-400 font-medium">👆 Select Wing, Program & Level to manage subjects.</p>
      ) : (
        <>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          ) : (
            <form onSubmit={handleAdd} className="flex items-end gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
              <div className="flex-1">
                <label className={labelCls}>Subject Name <span className="text-red-500">*</span></label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. C Programming" className={inputCls} />
              </div>
              <div className="w-32">
                <label className={labelCls}>Full Marks <span className="text-red-500">*</span></label>
                <input required type="number" value={form.fullMarks} onChange={e => setForm({ ...form, fullMarks: e.target.value })} className={inputCls} />
              </div>
              <div className="w-32">
                <label className={labelCls}>Pass Marks <span className="text-red-500">*</span></label>
                <input required type="number" value={form.passMarks} onChange={e => setForm({ ...form, passMarks: e.target.value })} className={inputCls} />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors whitespace-nowrap">Add</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500 p-2"><X className="w-5 h-5" /></button>
            </form>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 w-16">#</th>
                  <th className="p-4">Subject Name</th>
                  <th className="p-4 w-32">Full Marks</th>
                  <th className="p-4 w-32">Pass Marks</th>
                  <th className="p-4 w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-400">No subjects added yet.</td></tr>
                ) : subjects.map((s, i) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-400 font-semibold">{i + 1}</td>
                    <td className="p-4 font-bold text-slate-800">{s.name}</td>
                    <td className="p-4 font-semibold text-slate-700">{s.fullMarks}</td>
                    <td className="p-4 font-semibold text-slate-700">{s.passMarks}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// =============================================
// 3. EXAM SETUP TAB
// =============================================
function ExamSetupTab({ exams, setExams, setActiveTab }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', wing: 'Bachelors', programId: '', level: '', terminal: 'First Terminal' });
  const programs = PROGRAMS[form.wing] || [];
  const levels = form.programId ? (LEVELS[form.programId] || []) : [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.programId || !form.level || !form.terminal) return alert('Fill all fields!');
    setExams(prev => [{ id: Date.now(), ...form, status: 'Active' }, ...prev]);
    setForm({ name: '', wing: 'Bachelors', programId: '', level: '', terminal: 'First Terminal' });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-800">Manage Examinations</h4>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Exam
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-bold text-blue-800">New Examination</h5>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Exam Name <span className="text-red-500">*</span></label>
              <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. BCA 1st Sem Board 2082" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Wing</label>
              <select value={form.wing} onChange={e => setForm({ ...form, wing: e.target.value, programId: '', level: '' })} className={inputCls}>
                {WINGS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Program / Faculty</label>
              <select value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value, level: '' })} className={inputCls}>
                <option value="">-- Select --</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{programs.find(p => p.id === form.programId)?.type === 'semester' ? 'Semester' : 'Year / Class'}</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className={inputCls} disabled={!form.programId}>
                <option value="">-- Select --</option>
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Terminal <span className="text-red-500">*</span></label>
              <select value={form.terminal} onChange={e => setForm({ ...form, terminal: e.target.value })} className={inputCls}>
                {TERMINALS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Create Exam</button>
            </div>
          </form>
        </div>
      )}

      {/* Exam List */}
      <div className="grid gap-3">
        {exams.length === 0 && <p className="text-center text-slate-400 py-10">No exams created yet. Click "Create Exam" to start.</p>}
        {exams.map(exam => {
          const prog = Object.values(PROGRAMS).flat().find(p => p.id === exam.programId);
          return (
            <div key={exam.id} className={`border rounded-xl p-4 flex items-center justify-between transition-all ${exam.status === 'Published' ? 'bg-green-50/30 border-green-200' : 'bg-white border-slate-200 hover:shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${exam.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">{exam.name}</h5>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100">{exam.wing}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span>{prog?.name}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span>{exam.level}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100">{exam.terminal}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${exam.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{exam.status}</span>
                {exam.status === 'Active' && (
                  <button onClick={() => setActiveTab('entry')} className="text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Enter Marks</button>
                )}
                <button onClick={() => { if (window.confirm('Delete?')) setExams(exams.filter(e => e.id !== exam.id)) }} className="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================
// 4. MARKS ENTRY TAB
// =============================================
function MarksEntryTab({ exams, studentsMap, subjectsMap, marksStore, setMarksStore, setActiveTab }) {
  const activeExams = exams.filter(e => e.status === 'Active');
  const [selectedExamId, setSelectedExamId] = useState(activeExams[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [localMarks, setLocalMarks] = useState({});

  const selectedExam = exams.find(e => e.id.toString() === selectedExamId.toString());
  const dataKey = selectedExam ? `${selectedExam.programId}__${selectedExam.level}` : '';
  const subjects = subjectsMap[dataKey] || [];
  const students = studentsMap[dataKey] || [];
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Auto-select first subject
  React.useEffect(() => {
    if (subjects.length > 0 && !subjects.find(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Load marks
  React.useEffect(() => {
    if (!selectedExamId || !selectedSubjectId) return;
    const examMarks = marksStore[selectedExamId] || {};
    const init = {};
    students.forEach(s => { init[s.id] = examMarks[s.id]?.[selectedSubjectId] ?? ''; });
    setLocalMarks(init);
  }, [selectedExamId, selectedSubjectId, marksStore, students]);

  const handleSave = () => {
    if (!selectedExamId || !selectedSubjectId) return;
    const updated = { ...marksStore };
    if (!updated[selectedExamId]) updated[selectedExamId] = {};
    students.forEach(s => {
      if (!updated[selectedExamId][s.id]) updated[selectedExamId][s.id] = {};
      const val = localMarks[s.id];
      updated[selectedExamId][s.id][selectedSubjectId] = val === '' ? '' : parseInt(val);
    });
    setMarksStore(updated);
    alert(`✅ Marks saved for "${currentSubject?.name}"!`);
  };

  if (activeExams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileSpreadsheet className="w-16 h-16 text-slate-300 mb-4" />
        <h4 className="text-xl font-bold text-slate-700">No Active Exams</h4>
        <p className="text-slate-500 mt-2">Create an exam first in the Exam Setup tab.</p>
        <button onClick={() => setActiveTab('exams')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Go to Setup</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="md:col-span-2">
          <label className={labelCls}>Select Exam</label>
          <select value={selectedExamId} onChange={e => { setSelectedExamId(e.target.value); setSelectedSubjectId(''); }} className={`${inputCls} font-semibold`}>
            {activeExams.map(e => {
              const prog = Object.values(PROGRAMS).flat().find(p => p.id === e.programId);
              return <option key={e.id} value={e.id}>{e.name} • {prog?.name} {e.level} • {e.terminal}</option>
            })}
          </select>
        </div>
        <div>
          <label className={labelCls}>Subject</label>
          <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className={`${inputCls} font-semibold`}>
            {subjects.length === 0 && <option>-- No subjects --</option>}
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (FM: {s.fullMarks})</option>)}
          </select>
        </div>
      </div>

      {students.length === 0 || subjects.length === 0 ? (
        <div className="text-center py-10">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-400" />
          <p className="font-semibold text-slate-600">{students.length === 0 ? 'No students added for this class.' : 'No subjects added for this class.'}</p>
          <p className="text-sm text-slate-500 mt-1">Go to the {students.length === 0 ? 'Students' : 'Subjects'} tab to add them first.</p>
        </div>
      ) : (
        <>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Marks Entry: {currentSubject?.name || '-'}</h4>
            <p className="text-sm text-slate-500">Full Marks: <strong>{currentSubject?.fullMarks}</strong> • Pass Marks: <strong>{currentSubject?.passMarks}</strong> • {selectedExam?.terminal}</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 w-32">Symbol No.</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 w-40">Obtained Marks</th>
                  <th className="p-4 w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => {
                  const val = localMarks[s.id];
                  const numVal = val === '' || val === undefined ? null : parseInt(val);
                  const isFail = numVal !== null && numVal < (currentSubject?.passMarks || 40);

                  return (
                    <tr key={s.id} className={`hover:bg-slate-50 ${isFail ? 'bg-red-50/40' : ''}`}>
                      <td className="p-4 font-bold text-blue-700">{s.symbol}</td>
                      <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                      <td className="p-4">
                        <input type="number" min="0" max={currentSubject?.fullMarks}
                          value={val ?? ''}
                          onChange={e => setLocalMarks(prev => ({ ...prev, [s.id]: e.target.value }))}
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFail ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-slate-200 text-slate-700'}`}
                          placeholder={`0 - ${currentSubject?.fullMarks}`}
                        />
                      </td>
                      <td className="p-4">
                        {numVal === null ? <span className="text-xs text-slate-400">—</span>
                          : isFail ? <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Fail</span>
                            : <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Pass</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-md shadow-blue-600/20">
              <Save className="w-5 h-5" /> Save Marks
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// =============================================
// 5. VIEW RESULTS TAB (Individual Marksheet)
// =============================================
function ViewResultsTab({ exams, studentsMap, subjectsMap, marksStore }) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [expandedStudent, setExpandedStudent] = useState(null);

  const selectedExam = exams.find(e => e.id.toString() === selectedExamId.toString());
  const dataKey = selectedExam ? `${selectedExam.programId}__${selectedExam.level}` : '';
  const subjects = subjectsMap[dataKey] || [];
  const students = studentsMap[dataKey] || [];
  const examMarks = marksStore[selectedExamId] || {};

  const getGrade = (pct) => {
    if (pct >= 90) return { g: 'A+', c: 'text-green-700 bg-green-100' };
    if (pct >= 80) return { g: 'A', c: 'text-green-700 bg-green-100' };
    if (pct >= 70) return { g: 'B+', c: 'text-blue-700 bg-blue-100' };
    if (pct >= 60) return { g: 'B', c: 'text-blue-700 bg-blue-100' };
    if (pct >= 50) return { g: 'C+', c: 'text-amber-700 bg-amber-100' };
    if (pct >= 40) return { g: 'C', c: 'text-amber-700 bg-amber-100' };
    return { g: 'F', c: 'text-red-700 bg-red-100' };
  };

  const studentResults = useMemo(() => {
    return students.map(s => {
      const sMarks = examMarks[s.id] || {};
      let total = 0, totalFull = 0, allEntered = true, hasFail = false;

      const subjectResults = subjects.map(sub => {
        const m = sMarks[sub.id];
        if (m === undefined || m === '') { allEntered = false; return { ...sub, obtained: '-', status: 'N/A' }; }
        total += m; totalFull += sub.fullMarks;
        if (m < sub.passMarks) hasFail = true;
        return { ...sub, obtained: m, status: m >= sub.passMarks ? 'Pass' : 'Fail' };
      });

      const pct = totalFull > 0 ? ((total / totalFull) * 100).toFixed(2) : '0.00';
      const grade = allEntered ? getGrade(parseFloat(pct)) : { g: '-', c: 'text-slate-400 bg-slate-100' };
      const overallStatus = !allEntered ? 'Incomplete' : hasFail ? 'Fail' : 'Pass';

      return { ...s, subjectResults, total, totalFull, pct, grade, overallStatus, allEntered };
    });
  }, [students, examMarks, subjects]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h4 className="text-lg font-bold text-slate-800">Student Results</h4>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Exam:</label>
          <select value={selectedExamId} onChange={e => { setSelectedExamId(e.target.value); setExpandedStudent(null); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
            {exams.map(e => {
              const prog = Object.values(PROGRAMS).flat().find(p => p.id === e.programId);
              return <option key={e.id} value={e.id}>{e.name} • {prog?.name} {e.level} • {e.terminal}</option>
            })}
          </select>
        </div>
      </div>

      {exams.length === 0 ? (
        <p className="text-center py-10 text-slate-400">No exams available.</p>
      ) : students.length === 0 ? (
        <p className="text-center py-10 text-slate-400">No students found for this exam's class.</p>
      ) : subjects.length === 0 ? (
        <p className="text-center py-10 text-slate-400">No subjects found for this exam's class.</p>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 w-28">Symbol</th>
                <th className="p-4">Student</th>
                <th className="p-4 w-28">Total</th>
                <th className="p-4 w-24">%</th>
                <th className="p-4 w-20">Grade</th>
                <th className="p-4 w-28">Result</th>
                <th className="p-4 w-32 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentResults.map(sr => (
                <React.Fragment key={sr.id}>
                  <tr className={`hover:bg-slate-50 ${sr.overallStatus === 'Fail' ? 'bg-red-50/30' : ''}`}>
                    <td className="p-4 font-bold text-blue-700">{sr.symbol}</td>
                    <td className="p-4 font-bold text-slate-700">{sr.name}</td>
                    <td className="p-4 font-semibold text-slate-400">{sr.overallStatus === 'Fail' ? '—' : sr.allEntered ? `${sr.total}/${sr.totalFull}` : '-'}</td>
                    <td className="p-4 font-bold text-slate-400">{sr.overallStatus === 'Fail' ? '—' : sr.allEntered ? `${sr.pct}%` : '-'}</td>
                    <td className="p-4">{sr.overallStatus === 'Fail' ? <span className="text-slate-400">—</span> : <span className={`px-2 py-0.5 rounded text-xs font-bold ${sr.grade.c}`}>{sr.grade.g}</span>}</td>
                    <td className="p-4">
                      {sr.overallStatus === 'Fail' ? (
                        <span className="px-3 py-1 rounded-md text-sm font-extrabold bg-red-100 text-red-700 tracking-wide">FAIL</span>
                      ) : sr.overallStatus === 'Pass' ? (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Pass</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500">{sr.overallStatus}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setExpandedStudent(expandedStudent === sr.id ? null : sr.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        {expandedStudent === sr.id ? 'Hide' : 'Marksheet'}
                      </button>
                    </td>
                  </tr>

                  {expandedStudent === sr.id && (
                    <tr>
                      <td colSpan="7" className="p-0">
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 border-t-2 border-blue-100">
                          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 text-center">
                              <h5 className="text-lg font-bold">MARKSHEET</h5>
                              <p className="text-sm text-blue-200 mt-1">{selectedExam?.name} • {selectedExam?.terminal}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 p-5 bg-slate-50 border-b border-slate-200 text-sm">
                              <div><span className="text-slate-500">Name:</span> <strong>{sr.name}</strong></div>
                              <div><span className="text-slate-500">Symbol:</span> <strong>{sr.symbol}</strong></div>
                              <div><span className="text-slate-500">Level:</span> <strong>{selectedExam?.level}</strong></div>
                            </div>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-slate-100 text-slate-600 text-xs uppercase">
                                  <th className="p-3 text-left">Subject</th>
                                  <th className="p-3 text-center">Full Marks</th>
                                  <th className="p-3 text-center">Pass Marks</th>
                                  <th className="p-3 text-center">Obtained</th>
                                  <th className="p-3 text-center">%</th>
                                  <th className="p-3 text-center">Result</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {sr.subjectResults.map(sub => {
                                  const subPct = sub.obtained !== '-' ? ((sub.obtained / sub.fullMarks) * 100).toFixed(1) : '-';
                                  return (
                                    <tr key={sub.id} className={sub.status === 'Fail' ? 'bg-red-50/40' : ''}>
                                      <td className="p-3 font-semibold text-slate-700">{sub.name}</td>
                                      <td className="p-3 text-center text-slate-500">{sub.fullMarks}</td>
                                      <td className="p-3 text-center text-slate-500">{sub.passMarks}</td>
                                      <td className={`p-3 text-center font-bold ${sub.status === 'Fail' ? 'text-red-600' : 'text-slate-800'}`}>{sub.obtained}</td>
                                      <td className={`p-3 text-center font-semibold ${sub.status === 'Fail' ? 'text-red-500' : 'text-slate-600'}`}>{subPct !== '-' ? `${subPct}%` : '-'}</td>
                                      <td className="p-3 text-center">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${sub.status === 'Pass' ? 'bg-green-100 text-green-700' : sub.status === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}>{sub.status}</span>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                              <tfoot className="border-t-2 border-slate-300 bg-slate-50">
                                {sr.overallStatus === 'Fail' ? (
                                  <tr>
                                    <td colSpan="6" className="p-0">
                                      <div className="flex items-center justify-center py-5 bg-red-50">
                                        <span className="text-2xl font-extrabold text-red-600 tracking-widest">✗ FAIL</span>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr className="font-bold text-slate-800">
                                    <td className="p-3">TOTAL</td>
                                    <td className="p-3 text-center">{sr.totalFull}</td>
                                    <td className="p-3"></td>
                                    <td className="p-3 text-center font-bold text-blue-600">{sr.total}</td>
                                    <td className="p-3 text-center font-bold text-blue-600">{sr.pct}%</td>
                                    <td className="p-3 text-center"><span className={`text-sm font-bold px-3 py-1 rounded ${sr.grade.c}`}>{sr.grade.g}</span></td>
                                  </tr>
                                )}
                              </tfoot>
                            </table>
                            <div className={`p-4 flex justify-between items-center border-t ${sr.overallStatus === 'Fail' ? 'bg-red-50' : 'bg-slate-50'}`}>
                              {sr.overallStatus === 'Fail' ? (
                                <span className="text-sm font-extrabold text-red-600">Overall Result: FAIL</span>
                              ) : (
                                <span className="text-xs text-slate-500">Overall: <strong className="text-green-600">Pass</strong> — Grade: <strong>{sr.grade.g}</strong> ({sr.pct}%)</span>
                              )}
                              <button className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 text-xs"><Printer className="w-3 h-3" /> Print</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// =============================================
// 6. PUBLISH TAB
// =============================================
function PublishTab({ exams, setExams, studentsMap, marksStore }) {
  const handlePublish = (id) => {
    if (window.confirm('Publish? Students will see results online.')) {
      setExams(exams.map(e => e.id === id ? { ...e, status: 'Published' } : e));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-bold text-slate-800">Publish Results</h4>
      {exams.length === 0 && <p className="text-center py-10 text-slate-400">No exams available.</p>}
      {exams.map(exam => {
        const isPublished = exam.status === 'Published';
        const prog = Object.values(PROGRAMS).flat().find(p => p.id === exam.programId);
        const sKey = `${exam.programId}__${exam.level}`;
        const studentCount = (studentsMap[sKey] || []).length;
        const hasMarks = !!marksStore[exam.id];

        return (
          <div key={exam.id} className={`border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between transition-all ${isPublished ? 'bg-green-50/40 border-green-200' : 'bg-white border-slate-200 hover:shadow-md'}`}>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h5 className="font-bold text-slate-800 text-lg">{exam.name}</h5>
                {isPublished ? <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded">✅ Published</span> : <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] uppercase font-bold rounded">⏳ Unpublished</span>}
              </div>
              <div className="flex gap-3 mt-2 text-sm text-slate-500 font-medium flex-wrap">
                <span>{exam.wing} → {prog?.name} → {exam.level}</span>
                <span>• {exam.terminal}</span>
                <span>• {studentCount} Students</span>
              </div>
              {!isPublished && !hasMarks && <p className="text-sm text-red-500 font-semibold mt-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> No marks entered yet.</p>}
              {!isPublished && hasMarks && <p className="text-sm text-blue-600 font-semibold mt-2 flex items-center gap-1"><ClipboardCheck className="w-4 h-4" /> Ready to publish!</p>}
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {!isPublished && hasMarks && (
                <button onClick={() => handlePublish(exam.id)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md shadow-emerald-600/20">
                  <CheckCircle2 className="w-4 h-4" /> Publish
                </button>
              )}
              {isPublished && (
                <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50"><Printer className="w-4 h-4" /> Print All</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
