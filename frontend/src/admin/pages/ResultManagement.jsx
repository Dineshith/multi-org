import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CheckCircle2, Settings, Edit3, TableProperties } from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS, TERMINALS } from '../config/orgConfig';

import { ImportMarksCSVModal, MarkSheetModal } from './results/Modals';

// --- Helper to load persistent data ---
const loadData = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export default function ResultManagement() {
  const [showImportModal, setShowImportModal] = useState(false);

  // New State: Dynamic Subjects, Marks, and Symbol Numbers from localStorage
  const [subjects, setSubjects] = useState(() => loadData('multi_org_subjects', [])); // { id, levelId, name, fullMarks, passMarks }
  const [studentMarks, setStudentMarks] = useState(() => loadData('multi_org_marks', {}));
  const [symbolNumbers, setSymbolNumbers] = useState(() => loadData('multi_org_symbols', {}));
  const [publishStatus, setPublishStatus] = useState(() => loadData('multi_org_publish_status', {}));

  // Setup Tab State
  const [setupWing, setSetupWing] = useState('');
  const [setupProgram, setSetupProgram] = useState('');
  const [setupLevel, setSetupLevel] = useState('');

  // Entry Tab State
  const [entryWing, setEntryWing] = useState('');
  const [entryProgram, setEntryProgram] = useState('');
  const [entryLevel, setEntryLevel] = useState('');
  const [entryTerminal, setEntryTerminal] = useState('');
  const [selectedStudentForResult, setSelectedStudentForResult] = useState(null);

  // Auto-save logic
  useEffect(() => { localStorage.setItem('multi_org_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('multi_org_marks', JSON.stringify(studentMarks)); }, [studentMarks]);
  useEffect(() => { localStorage.setItem('multi_org_symbols', JSON.stringify(symbolNumbers)); }, [symbolNumbers]);
  useEffect(() => { localStorage.setItem('multi_org_publish_status', JSON.stringify(publishStatus)); }, [publishStatus]);

  const handleMarkChange = (levelId, terminal, studentId, subjectId, value) => {
    const key = `${levelId}-${terminal}-${studentId}-${subjectId}`;
    setStudentMarks(prev => ({ ...prev, [key]: value }));
  };

  const handleSymbolChange = (levelId, terminal, studentId, value) => {
    const key = `${levelId}-${terminal}-${studentId}`;
    setSymbolNumbers(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveMarks = () => {
    alert("Marks and Symbol Numbers saved successfully!");
  };

  const getPrograms = (wing) => PROGRAMS[wing] || [];
  const getLevels = (programId) => LEVELS[programId] || [];
  const getSubjects = (levelId) => subjects.filter(s => s.levelId === levelId);

  const getDynamicStudents = (wing, programId, level) => {
    const allStudents = loadData('multi_org_students', []);
    return allStudents
      .filter(s => s.wing === wing && s.programId === programId && s.level === level && s.status === 'Active')
      .sort((a, b) => (Number(a.roll) || 9999) - (Number(b.roll) || 9999));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Result Management</h3>
        <p className="text-slate-500 mt-1">Manage student marks, setup subjects, or publish results.</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <NavLink to="entry" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Edit3 className="w-4 h-4" /> Marks Entry
        </NavLink>
        <NavLink to="ledger" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <TableProperties className="w-4 h-4" /> View Ledger
        </NavLink>
        <NavLink to="setup" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Settings className="w-4 h-4" /> Subject Setup
        </NavLink>
        <div className="w-px bg-slate-300 mx-1 my-2"></div>
        <NavLink to="publish" className={({isActive}) => `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CheckCircle2 className="w-4 h-4" /> Publish Result
        </NavLink>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
        <Outlet context={{
          subjects, setSubjects,
          setupWing, setSetupWing,
          setupProgram, setSetupProgram,
          setupLevel, setSetupLevel,
          entryWing, setEntryWing,
          entryProgram, setEntryProgram,
          entryLevel, setEntryLevel,
          entryTerminal, setEntryTerminal,
          getPrograms, getLevels, getDynamicStudents, getSubjects,
          studentMarks, handleMarkChange,
          handleSymbolChange, symbolNumbers,
          handleSaveMarks, setShowImportModal,
          setSelectedStudentForResult,
          publishStatus, setPublishStatus
        }} />
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportMarksCSVModal
          onClose={() => setShowImportModal(false)}
          entryWing={entryWing}
          entryProgram={entryProgram}
          entryLevel={entryLevel}
          entryTerminal={entryTerminal}
          subjects={getSubjects(entryLevel)}
          classStudents={getDynamicStudents(entryWing, entryProgram, entryLevel)}
          existingSymbols={symbolNumbers}
          onImport={(importedMarks, importedSymbols) => {
            setStudentMarks(prev => ({ ...prev, ...importedMarks }));
            setSymbolNumbers(prev => ({ ...prev, ...importedSymbols }));
            setShowImportModal(false);
            alert('Marks and Symbols imported successfully!');
          }}
        />
      )}

      {/* Mark Sheet Modal */}
      {selectedStudentForResult && (
        <MarkSheetModal
          student={selectedStudentForResult}
          onClose={() => setSelectedStudentForResult(null)}
          entryWing={entryWing}
          entryProgram={entryProgram}
          entryLevel={entryLevel}
          entryTerminal={entryTerminal}
          subjects={getSubjects(entryLevel)}
          studentMarks={studentMarks}
          symbolNumbers={symbolNumbers}
        />
      )}
    </div>
  );
}
