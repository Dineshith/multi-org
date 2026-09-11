import React from 'react';
import { Edit3, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { WINGS, TERMINALS } from '../../config/orgConfig';

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

import { useOutletContext } from 'react-router-dom';

export default function MarksEntry() {
  const { 
    entryWing, setEntryWing, 
    entryProgram, setEntryProgram, 
    entryLevel, setEntryLevel, 
    entryTerminal, setEntryTerminal, 
    getPrograms, getLevels, getDynamicStudents, getSubjects, 
    studentMarks, handleMarkChange, 
    handleSymbolChange, symbolNumbers, 
    handleSaveMarks, setShowImportModal 
  } = useOutletContext();

  const dynamicStudents = getDynamicStudents(entryWing, entryProgram, entryLevel);
  const subjects = getSubjects(entryLevel);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-600" /> Enter Student Marks
        </h4>
        {entryLevel && subjects.length > 0 && dynamicStudents.length > 0 && (
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Import Marks from CSV
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className={labelCls}>Wing</label>
          <select className={selectCls} value={entryWing} onChange={(e) => { setEntryWing(e.target.value); setEntryProgram(''); setEntryLevel(''); }}>
            <option value="">Select Wing</option>
            {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Program</label>
          <select className={selectCls} value={entryProgram} onChange={(e) => { setEntryProgram(e.target.value); setEntryLevel(''); }} disabled={!entryWing}>
            <option value="">Select Program</option>
            {getPrograms(entryWing).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Level/Class</label>
          <select className={selectCls} value={entryLevel} onChange={(e) => setEntryLevel(e.target.value)} disabled={!entryProgram}>
            <option value="">Select Level</option>
            {getLevels(entryProgram).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Terminal/Exam</label>
          <select className={selectCls} value={entryTerminal} onChange={(e) => setEntryTerminal(e.target.value)}>
            <option value="">Select Exam</option>
            {TERMINALS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {entryLevel && entryTerminal ? (
        dynamicStudents.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No active students found in this class. Please add them in Student Management.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
            {subjects.length === 0 && (
              <div className="bg-amber-50 text-amber-800 p-4 border-b border-amber-200 flex items-center justify-center font-medium text-sm text-center">
                ⚠️ Subjects are not set up yet! Here are the students automatically linked from Student Management. You can assign Symbol Numbers now, but please set up subjects to enter marks.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 uppercase font-bold text-xs w-16">Roll</th>
                    <th className="px-4 py-3 uppercase font-bold text-xs sticky left-0 bg-slate-50 z-10 w-48">Student Name</th>
                    <th className="px-4 py-3 uppercase font-bold text-xs w-32 border-r border-slate-200">Symbol No.</th>
                    {subjects.map(sub => (
                      <th key={sub.id} className="px-4 py-3 uppercase font-bold text-xs text-center w-24">
                        <div className="flex flex-col items-center">
                          <span>{sub.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">FM: {sub.fullMarks}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicStudents.map(student => {
                    const symbolKey = `${entryLevel}-${entryTerminal}-${student.id}`;
                    return (
                      <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{student.roll}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800 sticky left-0 bg-white z-10">{student.name}</td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <input 
                            type="text" 
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Symbol..."
                            value={symbolNumbers[symbolKey] || ''}
                            onChange={(e) => handleSymbolChange(entryLevel, entryTerminal, student.id, e.target.value)}
                          />
                        </td>
                        {subjects.map(sub => {
                          const key = `${entryLevel}-${entryTerminal}-${student.id}-${sub.id}`;
                          return (
                            <td key={sub.id} className="px-4 py-3">
                              <input 
                                type="number" 
                                min="0" 
                                max={sub.fullMarks}
                                className="w-16 mx-auto block px-2 py-1.5 border border-slate-200 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={studentMarks[key] !== undefined ? studentMarks[key] : ''}
                                onChange={(e) => handleMarkChange(entryLevel, entryTerminal, student.id, sub.id, e.target.value)}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={handleSaveMarks} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                <CheckCircle2 className="w-5 h-5" /> Save Marks
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Select criteria above to start entering marks.</p>
        </div>
      )}
    </div>
  );
}
