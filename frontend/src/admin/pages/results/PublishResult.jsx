import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, LayoutTemplate, AlignLeft, Globe, XCircle } from 'lucide-react';
import { WINGS, TERMINALS } from '../../config/orgConfig';

const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function PublishResult() {
  const { 
    entryWing, setEntryWing, 
    entryProgram, setEntryProgram, 
    entryTerminal, setEntryTerminal, 
    getPrograms, getLevels,
    publishStatus, setPublishStatus
  } = useOutletContext();

  const [publishMode, setPublishMode] = useState('SUMMARY'); // 'SUMMARY' or 'FULL'

  const levels = getLevels(entryProgram);

  const handlePublishToggle = (level, currentStatus) => {
    if (!entryTerminal) {
      alert("Please select a Terminal/Exam first.");
      return;
    }

    const key = `${level}-${entryTerminal}`;
    
    if (currentStatus) {
      // Unpublish
      if (window.confirm(`Are you sure you want to unpublish results for ${level}? Students will no longer be able to see them.`)) {
        const newStatus = { ...publishStatus };
        delete newStatus[key];
        setPublishStatus(newStatus);
      }
    } else {
      // Publish
      setPublishStatus({
        ...publishStatus,
        [key]: {
          mode: publishMode,
          date: new Date().toLocaleDateString()
        }
      });
    }
  };

  const handleBulkPublish = () => {
    if (!entryTerminal || levels.length === 0) return;
    if (window.confirm(`Publish results for ALL ${levels.length} classes in ${entryProgram}?`)) {
      const newStatus = { ...publishStatus };
      levels.forEach(level => {
        const key = `${level}-${entryTerminal}`;
        newStatus[key] = {
          mode: publishMode,
          date: new Date().toLocaleDateString()
        };
      });
      setPublishStatus(newStatus);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" /> Publish Digital Results
        </h4>
        {levels.length > 0 && entryTerminal && (
          <button onClick={handleBulkPublish} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Publish All Listed Classes
          </button>
        )}
      </div>
      
      {/* Criteria Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className={labelCls}>Wing</label>
          <select className={selectCls} value={entryWing} onChange={(e) => { setEntryWing(e.target.value); setEntryProgram(''); }}>
            <option value="">Select Wing</option>
            {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Program</label>
          <select className={selectCls} value={entryProgram} onChange={(e) => { setEntryProgram(e.target.value); }} disabled={!entryWing}>
            <option value="">Select Program</option>
            {getPrograms(entryWing).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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

      {entryProgram && entryTerminal ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          
          {/* Mode Selection */}
          <div className="mb-8 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <h5 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Publishing Mode Settings</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Summary Option */}
              <div 
                onClick={() => setPublishMode('SUMMARY')}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex items-start gap-4 ${
                  publishMode === 'SUMMARY' 
                    ? 'border-blue-600 bg-white shadow-sm' 
                    : 'border-transparent bg-white hover:border-blue-200'
                }`}
              >
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${publishMode === 'SUMMARY' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {publishMode === 'SUMMARY' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <h6 className={`font-bold text-sm mb-1 ${publishMode === 'SUMMARY' ? 'text-blue-900' : 'text-slate-700'}`}>Summary Only (GPA)</h6>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Students will only see their Final GPA and Pass/Fail status. Subject marks remain hidden.
                  </p>
                </div>
              </div>

              {/* Full Sheet Option */}
              <div 
                onClick={() => setPublishMode('FULL')}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex items-start gap-4 ${
                  publishMode === 'FULL' 
                    ? 'border-blue-600 bg-white shadow-sm' 
                    : 'border-transparent bg-white hover:border-blue-200'
                }`}
              >
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${publishMode === 'FULL' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {publishMode === 'FULL' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <h6 className={`font-bold text-sm mb-1 ${publishMode === 'FULL' ? 'text-blue-900' : 'text-slate-700'}`}>Full Grade Sheet</h6>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Students can view and print their complete Grade Sheet with subject-wise marks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Classes Table */}
          <h5 className="font-bold text-slate-800 text-lg mb-4">Classes Status Overview</h5>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-5 py-3 font-bold uppercase text-xs">Class / Level</th>
                    <th className="px-5 py-3 font-bold uppercase text-xs">Terminal</th>
                    <th className="px-5 py-3 font-bold uppercase text-xs">Status</th>
                    <th className="px-5 py-3 font-bold uppercase text-xs">Mode</th>
                    <th className="px-5 py-3 font-bold uppercase text-xs">Published On</th>
                    <th className="px-5 py-3 font-bold uppercase text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levels.map(level => {
                    const key = `${level}-${entryTerminal}`;
                    const status = publishStatus[key];
                    const isPublished = !!status;

                    return (
                      <tr key={level} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-bold text-slate-800">{level}</td>
                        <td className="px-5 py-3 text-slate-600">{entryTerminal}</td>
                        <td className="px-5 py-3">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                              Draft (Hidden)
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {isPublished ? (
                            status.mode === 'SUMMARY' ? (
                              <span className="flex items-center gap-1.5 text-xs font-semibold"><AlignLeft className="w-3.5 h-3.5" /> Summary Only</span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-semibold"><LayoutTemplate className="w-3.5 h-3.5" /> Full Sheet</span>
                            )
                          ) : '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-500 text-xs">
                          {isPublished ? status.date : '—'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {isPublished ? (
                            <button 
                              onClick={() => handlePublishToggle(level, status)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Unpublish
                            </button>
                          ) : (
                            <button 
                              onClick={() => handlePublishToggle(level, null)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Publish Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {levels.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-slate-500">
                        No classes found for this program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Select a Wing, Program, and Exam to view class statuses.</p>
        </div>
      )}
    </div>
  );
}
