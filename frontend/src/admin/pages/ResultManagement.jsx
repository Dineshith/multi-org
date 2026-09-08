import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, FileImage, Settings, Edit3, TableProperties, Plus } from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS, TERMINALS } from '../config/orgConfig';

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

// Dummy students generator
const generateDummyStudents = (levelId) => {
  return [
    { id: 's1', name: 'Aarav Sharma', roll: '1' },
    { id: 's2', name: 'Bipisha Thapa', roll: '2' },
    { id: 's3', name: 'Chirag Shrestha', roll: '3' },
    { id: 's4', name: 'Diksha Gurung', roll: '4' },
    { id: 's5', name: 'Eshan Maharjan', roll: '5' },
  ];
};

export default function ResultManagement() {
  const [activeTab, setActiveTab] = useState('entry'); // Defaulting to the new feature
  const [publishedResults, setPublishedResults] = useState([]);
  
  // Existing Form State for Image Upload
  const [title, setTitle] = useState('');
  const [examName, setExamName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // New State: Dynamic Subjects & Marks
  const [subjects, setSubjects] = useState([]); // { id, levelId, name, fullMarks, passMarks }
  const [studentMarks, setStudentMarks] = useState({}); // key: `${levelId}-${terminal}-${studentId}-${subjectId}`, value: marks

  // Setup Tab State
  const [setupWing, setSetupWing] = useState('');
  const [setupProgram, setSetupProgram] = useState('');
  const [setupLevel, setSetupLevel] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubFull, setNewSubFull] = useState('100');
  const [newSubPass, setNewSubPass] = useState('40');

  // Entry Tab State
  const [entryWing, setEntryWing] = useState('');
  const [entryProgram, setEntryProgram] = useState('');
  const [entryLevel, setEntryLevel] = useState('');
  const [entryTerminal, setEntryTerminal] = useState('');

  // --- Image Upload Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handlePublishImage = (e) => {
    e.preventDefault();
    if (!title || !examName || !imagePreview) {
      alert("Please fill all fields and select an image.");
      return;
    }
    const newResult = { id: Date.now(), title, examName, imagePreview, date: new Date().toLocaleDateString() };
    setPublishedResults([newResult, ...publishedResults]);
    setTitle(''); setExamName(''); setImagePreview(null);
    alert("Result image published successfully!");
    setActiveTab('published');
  };

  const handleDeleteImage = (id) => {
    if (window.confirm("Are you sure you want to delete this result image?")) {
      setPublishedResults(publishedResults.filter(r => r.id !== id));
    }
  };

  // --- Dynamic Results Handlers ---
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

  const handleMarkChange = (levelId, terminal, studentId, subjectId, value) => {
    const key = `${levelId}-${terminal}-${studentId}-${subjectId}`;
    setStudentMarks(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveMarks = () => {
    alert("Marks saved successfully!");
  };

  // Helper to get programs based on wing
  const getPrograms = (wing) => PROGRAMS[wing] || [];
  const getLevels = (programId) => LEVELS[programId] || [];
  const getSubjects = (levelId) => subjects.filter(s => s.levelId === levelId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Result Management</h3>
        <p className="text-slate-500 mt-1">Manage student marks, setup subjects, or upload result images.</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('entry')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'entry' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Edit3 className="w-4 h-4" /> Marks Entry
        </button>
        <button onClick={() => setActiveTab('ledger')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'ledger' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <TableProperties className="w-4 h-4" /> View Ledger
        </button>
        <button onClick={() => setActiveTab('setup')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'setup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Settings className="w-4 h-4" /> Subject Setup
        </button>
        <div className="w-px bg-slate-300 mx-1 my-2"></div>
        <button onClick={() => setActiveTab('upload')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Upload className="w-4 h-4" /> Upload Result Image
        </button>
        <button onClick={() => setActiveTab('published')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'published' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <FileImage className="w-4 h-4" /> Image Results
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
        
        {/* ================= SUBJECT SETUP ================= */}
        {activeTab === 'setup' && (
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
                            <tr key={sub.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-slate-800">{sub.name}</td>
                              <td className="px-4 py-3">{sub.fullMarks}</td>
                              <td className="px-4 py-3">{sub.passMarks}</td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => handleDeleteSubject(sub.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
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
        )}

        {/* ================= MARKS ENTRY ================= */}
        {activeTab === 'entry' && (
          <div>
             <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> Enter Student Marks
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
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
                  <option value="">Select Terminal</option>
                  {TERMINALS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {entryLevel && entryTerminal ? (
              getSubjects(entryLevel).length === 0 ? (
                <div className="text-center py-12 bg-amber-50 rounded-xl border border-dashed border-amber-200">
                  <p className="text-amber-700 font-medium">Please add subjects for this class in the "Subject Setup" tab first.</p>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs">
                        <tr>
                          <th className="px-4 py-3 uppercase font-bold w-16">Roll</th>
                          <th className="px-4 py-3 uppercase font-bold w-48 sticky left-0 bg-slate-50">Student Name</th>
                          {getSubjects(entryLevel).map(sub => (
                            <th key={sub.id} className="px-4 py-3 uppercase font-bold w-24">
                              {sub.name} <span className="text-[10px] text-slate-400 block font-normal">FM: {sub.fullMarks}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {generateDummyStudents(entryLevel).map(student => (
                          <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/30">
                            <td className="px-4 py-3">{student.roll}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white">{student.name}</td>
                            {getSubjects(entryLevel).map(sub => {
                              const key = `${entryLevel}-${entryTerminal}-${student.id}-${sub.id}`;
                              return (
                                <td key={sub.id} className="px-4 py-2">
                                  <input 
                                    type="number" 
                                    className="w-16 px-2 py-1.5 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center"
                                    value={studentMarks[key] || ''}
                                    onChange={(e) => handleMarkChange(entryLevel, entryTerminal, student.id, sub.id, e.target.value)}
                                  />
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleSaveMarks} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg flex items-center gap-2 transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Save Marks
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">Select Wing, Program, Level, and Terminal to start entering marks.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW LEDGER ================= */}
        {activeTab === 'ledger' && (
           <div>
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TableProperties className="w-5 h-5 text-blue-600" /> Result Ledger
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
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
                  <option value="">Select Terminal</option>
                  {TERMINALS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {entryLevel && entryTerminal ? (
               getSubjects(entryLevel).length === 0 ? (
                <div className="text-center py-12 bg-amber-50 rounded-xl border border-dashed border-amber-200">
                  <p className="text-amber-700 font-medium">No subjects found. Please configure subjects first.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs">
                      <tr>
                        <th className="px-4 py-3 uppercase font-bold w-16">Roll</th>
                        <th className="px-4 py-3 uppercase font-bold w-48 sticky left-0 bg-slate-50">Student Name</th>
                        {getSubjects(entryLevel).map(sub => (
                          <th key={sub.id} className="px-4 py-3 uppercase font-bold w-24 text-center">
                            {sub.name}
                          </th>
                        ))}
                        <th className="px-4 py-3 uppercase font-bold w-24 text-center border-l border-slate-200">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateDummyStudents(entryLevel).map(student => {
                        let total = 0;
                        return (
                          <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/30">
                            <td className="px-4 py-3">{student.roll}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white">{student.name}</td>
                            {getSubjects(entryLevel).map(sub => {
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
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">Select criteria above to view the ledger.</p>
              </div>
            )}
          </div>
        )}


        {/* ================= EXISTING: IMAGE UPLOAD ================= */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Publish Result Image
            </h4>
            <form onSubmit={handlePublishImage} className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Result Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Class 10 Final Results" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Exam/Terminal Name</label>
                <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="e.g. Second Terminal Examination 2080" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Result Image</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                          <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                            <span>Upload a file</span>
                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20">
                <CheckCircle2 className="w-5 h-5" /> Publish Result Image
              </button>
            </form>
          </div>
        )}

        {activeTab === 'published' && (
          <div>
             <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-blue-600" /> All Published Image Results
            </h4>
            
            {publishedResults.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No results published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedResults.map((res) => (
                  <div key={res.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow group">
                    <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
                      <img src={res.imagePreview} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h5 className="font-bold text-slate-800">{res.title}</h5>
                      <p className="text-sm text-slate-500 mt-1">{res.examName}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">{res.date}</span>
                        <button onClick={() => handleDeleteImage(res.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
