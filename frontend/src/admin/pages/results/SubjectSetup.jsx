import React, { useState } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS } from '../../config/orgConfig';

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

import { useOutletContext } from 'react-router-dom';

export default function SubjectSetup() {
  const { subjects, setSubjects, setupWing, setSetupWing, setupProgram, setSetupProgram, setupLevel, setSetupLevel } = useOutletContext();
  const [newSubName, setNewSubName] = useState('');
  const [newSubFull, setNewSubFull] = useState('100');
  const [newSubPass, setNewSubPass] = useState('40');

  const getPrograms = (wing) => PROGRAMS[wing] || [];
  const getLevels = (programId) => LEVELS[programId] || [];
  const getSubjects = (levelId) => subjects.filter(s => s.levelId === levelId);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!setupLevel || !newSubName || !newSubFull || !newSubPass) return;
    
    const newSub = {
      id: Date.now().toString(),
      levelId: setupLevel,
      name: newSubName,
      fullMarks: Number(newSubFull),
      passMarks: Number(newSubPass)
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div>
      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" /> Subject Setup
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className={labelCls}>Wing</label>
          <select className={selectCls} value={setupWing} onChange={(e) => { setSetupWing(e.target.value); setSetupProgram(''); setSetupLevel(''); }}>
            <option value="">Select Wing</option>
            {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Program</label>
          <select className={selectCls} value={setupProgram} onChange={(e) => { setSetupProgram(e.target.value); setSetupLevel(''); }} disabled={!setupWing}>
            <option value="">Select Program</option>
            {getPrograms(setupWing).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Level/Class</label>
          <select className={selectCls} value={setupLevel} onChange={(e) => setSetupLevel(e.target.value)} disabled={!setupProgram}>
            <option value="">Select Level</option>
            {getLevels(setupProgram).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {setupLevel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-800 mb-4">Add New Subject</h5>
              <form onSubmit={handleAddSubject} className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Subject Name</label>
                  <input type="text" required value={newSubName} onChange={e => setNewSubName(e.target.value)} className={inputCls} placeholder="e.g. Mathematics" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Marks</label>
                    <input type="number" required value={newSubFull} onChange={e => setNewSubFull(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Pass Marks</label>
                    <input type="number" required value={newSubPass} onChange={e => setNewSubPass(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Subject
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h5 className="font-bold text-slate-800 mb-4">Assigned Subjects for {setupLevel}</h5>
            {getSubjects(setupLevel).length === 0 ? (
               <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                 <p className="text-slate-500 font-medium">No subjects configured for this class.</p>
               </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Subject Name</th>
                      <th className="px-4 py-3 w-24">Full Marks</th>
                      <th className="px-4 py-3 w-24">Pass Marks</th>
                      <th className="px-4 py-3 w-16 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSubjects(setupLevel).map(sub => (
                      <tr key={sub.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-800">{sub.name}</td>
                        <td className="px-4 py-3">{sub.fullMarks}</td>
                        <td className="px-4 py-3">{sub.passMarks}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDeleteSubject(sub.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
