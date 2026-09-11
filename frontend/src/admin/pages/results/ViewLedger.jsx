import React from 'react';
import { TableProperties, FileImage } from 'lucide-react';
import { WINGS, TERMINALS } from '../../config/orgConfig';

const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

import { useOutletContext } from 'react-router-dom';

export default function ViewLedger() {
  const { 
    entryWing, setEntryWing, 
    entryProgram, setEntryProgram, 
    entryLevel, setEntryLevel, 
    entryTerminal, setEntryTerminal, 
    getPrograms, getLevels, getDynamicStudents, getSubjects, 
    studentMarks, symbolNumbers, setSelectedStudentForResult 
  } = useOutletContext();

  const dynamicStudents = getDynamicStudents(entryWing, entryProgram, entryLevel);
  const subjects = getSubjects(entryLevel);

  return (
    <div>
      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <TableProperties className="w-5 h-5 text-blue-600" /> Result Ledger
      </h4>
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
                ⚠️ Subjects are not set up yet! Here are the students automatically linked from Student Management. Please set up subjects to view full ledger.
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
                    <th className="px-4 py-3 uppercase font-bold w-24 text-center border-l border-slate-200">Total</th>
                    <th className="px-4 py-3 uppercase font-bold w-28 text-center border-l border-slate-200">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicStudents.map(student => {
                    const symbolKey = `${entryLevel}-${entryTerminal}-${student.id}`;
                    const symbolVal = symbolNumbers[symbolKey] || '—';
                    let total = 0;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">{student.roll}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white">{student.name}</td>
                        <td className="px-4 py-3 text-slate-500">{symbolVal}</td>
                        {subjects.map(sub => {
                          const key = `${entryLevel}-${entryTerminal}-${student.id}-${sub.id}`;
                          const val = Number(studentMarks[key]) || 0;
                          total += val;
                          return (
                            <td key={sub.id} className="px-4 py-3 text-center">
                              {studentMarks[key] !== undefined && studentMarks[key] !== '' ? studentMarks[key] : '-'}
                            </td>
                          )
                        })}
                        <td className="px-4 py-3 text-center font-bold text-blue-600 border-l border-slate-200">{total}</td>
                        <td className="px-4 py-3 text-center border-l border-slate-200">
                          <button 
                            onClick={() => setSelectedStudentForResult(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <FileImage className="w-3.5 h-3.5" /> Grade Sheet
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Select criteria above to view the ledger.</p>
        </div>
      )}
    </div>
  );
}
