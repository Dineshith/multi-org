import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, AlertCircle, FileText, CheckCircle2, XCircle, Printer, Award } from 'lucide-react';
import { WINGS, PROGRAMS, LEVELS, TERMINALS, ORG_INFO } from '../admin/config/orgConfig';

// Data Loader
const loadData = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

// Grading logic
const calculateGrade = (obtained, fullMarks) => {
  if (obtained === undefined || obtained === null || obtained === '' || isNaN(obtained) || !fullMarks || isNaN(fullMarks) || fullMarks === 0) return { grade: '-', gp: '-', remarks: '-' };
  const percentage = (Number(obtained) / Number(fullMarks)) * 100;
  
  if (percentage >= 90) return { grade: 'A+', gp: 4.0, remarks: 'Outstanding' };
  if (percentage >= 80) return { grade: 'A', gp: 3.6, remarks: 'Excellent' };
  if (percentage >= 70) return { grade: 'B+', gp: 3.2, remarks: 'Very Good' };
  if (percentage >= 60) return { grade: 'B', gp: 2.8, remarks: 'Good' };
  if (percentage >= 50) return { grade: 'C+', gp: 2.4, remarks: 'Satisfactory' };
  if (percentage >= 40) return { grade: 'C', gp: 2.0, remarks: 'Acceptable' };
  if (percentage >= 35) return { grade: 'D', gp: 1.6, remarks: 'Basic' };
  return { grade: 'NG', gp: 0.0, remarks: 'Not Graded' };
};

export default function ResultCheck() {
  const [wing, setWing] = useState('');
  const [program, setProgram] = useState('');
  const [level, setLevel] = useState('');
  const [terminal, setTerminal] = useState('');
  const [symbolNo, setSymbolNo] = useState('');
  
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);

  const availablePrograms = wing ? (PROGRAMS[wing] || []) : [];
  const availableLevels = program ? (LEVELS[program] || []) : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setResultData(null);

    if (!level || !terminal || !symbolNo) {
      setError('Please select Class/Exam and enter your Symbol Number.');
      return;
    }

    const publishStatus = loadData('multi_org_publish_status', {});
    const statusKey = `${level}-${terminal}`;
    const pStatus = publishStatus[statusKey];

    if (!pStatus) {
      setError('Results for this class and exam have not been published yet.');
      return;
    }

    const symbolNumbers = loadData('multi_org_symbols', {});
    let foundStudentId = null;
    
    // Find the student ID by symbol number for this specific exam
    for (const [key, sym] of Object.entries(symbolNumbers)) {
      if (key.startsWith(`${level}-${terminal}-`) && sym === symbolNo.trim()) {
        foundStudentId = key.replace(`${level}-${terminal}-`, '');
        break;
      }
    }

    if (!foundStudentId) {
      setError('Invalid Symbol Number. Please check and try again.');
      return;
    }

    const students = loadData('multi_org_students', []);
    const student = students.find(s => s.id === foundStudentId);

    if (!student) {
      setError('Student record not found in the database.');
      return;
    }

    const subjectsData = loadData('multi_org_subjects', []);
    const classSubjects = subjectsData.filter(s => s.levelId === level);

    const marksData = loadData('multi_org_marks', {});
    
    let totalGP = 0;
    let totalCredits = 0;
    let hasFailed = false;

    const marksWithGrades = classSubjects.map(sub => {
      const mk = marksData[`${level}-${terminal}-${student.id}-${sub.id}`];
      const obtained = mk !== undefined && mk !== '' ? Number(mk) : null;
      const { grade, gp, remarks } = calculateGrade(obtained, sub.fullMarks);
      if (grade === 'NG' || grade === 'D' || grade === '-') hasFailed = true;
      if (gp !== '-') {
        totalGP += Number(gp);
        totalCredits += 1;
      }
      return { ...sub, obtained, grade, gp, remarks };
    });

    const finalGPA = totalCredits > 0 ? (totalGP / totalCredits).toFixed(2) : '0.00';
    const finalStatus = hasFailed ? 'FAILED' : 'PASSED';

    setResultData({
      student,
      mode: pStatus.mode,
      date: pStatus.date,
      marks: marksWithGrades,
      finalGPA,
      finalStatus
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Digital Result Portal</h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">Enter your details below to securely view your official gradesheet and academic standing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
          
          {/* Search Form */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Search className="w-5 h-5 text-blue-500" /> Find Your Result
            </h3>
            
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Wing</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={wing} onChange={(e) => { setWing(e.target.value); setProgram(''); setLevel(''); }}>
                  <option value="">Select Wing</option>
                  {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Program</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={program} onChange={(e) => { setProgram(e.target.value); setLevel(''); }} disabled={!wing}>
                  <option value="">Select Program</option>
                  {availablePrograms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Class / Level</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={level} onChange={(e) => setLevel(e.target.value)} disabled={!program}>
                  <option value="">Select Class</option>
                  {availableLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Terminal / Exam</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={terminal} onChange={(e) => setTerminal(e.target.value)}>
                  <option value="">Select Exam</option>
                  {TERMINALS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Symbol Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12345" 
                  required
                  className="w-full px-3.5 py-3 bg-white border-2 border-slate-200 rounded-xl text-base font-bold text-slate-800 placeholder:font-normal focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  value={symbolNo} 
                  onChange={e => setSymbolNo(e.target.value)} 
                />
              </div>

              {error && (
                <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                Check Result
              </button>
            </form>
          </div>

          {/* Result Display Area */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {!resultData ? (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white border border-slate-200/60 border-dashed rounded-2xl text-slate-400 p-8 text-center">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-slate-600">Your Result Will Appear Here</h3>
                <p className="mt-2 text-sm max-w-md">Please fill in your details on the left and click "Check Result" to fetch your gradesheet.</p>
              </div>
            ) : (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Result Card Wrapper */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden relative">
                  
                  {/* Result Header */}
                  <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <h2 className="text-2xl md:text-3xl font-black text-white relative z-10 tracking-tight">{ORG_INFO.name}</h2>
                    <p className="text-slate-300 relative z-10 text-sm mt-1">{ORG_INFO.address} | {ORG_INFO.website}</p>
                    
                    <div className="mt-6 inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-2 relative z-10">
                      <p className="text-white font-bold tracking-widest uppercase text-sm">{terminal}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Student Info Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Student Name</p>
                        <p className="text-lg font-bold text-slate-800">{resultData.student.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Symbol No.</p>
                        <p className="text-lg font-bold text-slate-800">{symbolNo}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Class</p>
                        <p className="text-lg font-bold text-slate-800">{level}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Roll No.</p>
                        <p className="text-lg font-bold text-slate-800">{resultData.student.roll}</p>
                      </div>
                    </div>

                    {/* Mode Specific Display */}
                    {resultData.mode === 'SUMMARY' ? (
                      <div className="py-8 text-center bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <div className="mb-6 inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm">
                          {resultData.finalStatus === 'PASSED' ? (
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                          ) : (
                            <XCircle className="w-12 h-12 text-red-500" />
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-2">Final GPA</h4>
                        <p className="text-6xl font-black text-slate-800 mb-4">{resultData.finalGPA}</p>
                        
                        <div className={`inline-flex px-6 py-2 rounded-full font-bold text-sm tracking-wide ${
                          resultData.finalStatus === 'PASSED' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          STATUS: {resultData.finalStatus}
                        </div>
                        
                        <p className="mt-8 text-xs text-slate-400 max-w-sm mx-auto">
                          Note: The detailed gradesheet for this exam has been withheld by the administration. Please contact the school office for your complete printed transcript.
                        </p>
                      </div>
                    ) : (
                      <div className="animate-in fade-in duration-700">
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl mb-8">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-xs">
                              <tr>
                                <th className="px-5 py-4 font-bold">Subjects</th>
                                <th className="px-5 py-4 font-bold text-center w-24">Full Marks</th>
                                <th className="px-5 py-4 font-bold text-center w-24">Pass Marks</th>
                                <th className="px-5 py-4 font-bold text-center w-24">Obtained</th>
                                <th className="px-5 py-4 font-bold text-center w-24">Grade</th>
                                <th className="px-5 py-4 font-bold text-center w-24">Grade Point</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {resultData.marks.map((mark, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                  <td className="px-5 py-4 font-semibold text-slate-800">{mark.name}</td>
                                  <td className="px-5 py-4 text-center text-slate-500">{mark.fullMarks}</td>
                                  <td className="px-5 py-4 text-center text-slate-500">{mark.passMarks}</td>
                                  <td className="px-5 py-4 text-center font-bold text-slate-800">
                                    {mark.obtained !== null ? mark.obtained : '-'}
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                    <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg font-bold text-xs ${
                                      mark.grade === 'NG' || mark.grade === '-' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'
                                    }`}>
                                      {mark.grade}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-center font-bold text-slate-600">{mark.gp}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary Footer */}
                        <div className="flex flex-wrap items-center justify-between bg-slate-900 text-white rounded-2xl p-6 shadow-md">
                          <div className="flex items-center gap-8">
                            <div>
                              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Final Result</p>
                              <p className={`text-xl font-black tracking-wide ${resultData.finalStatus === 'PASSED' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {resultData.finalStatus}
                              </p>
                            </div>
                            <div className="w-px h-10 bg-slate-700"></div>
                            <div>
                              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Grade Point Average (GPA)</p>
                              <p className="text-2xl font-black text-amber-300">{resultData.finalGPA}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                      <p className="text-xs text-slate-400 font-medium">Published on: {resultData.date}</p>
                      
                      {resultData.mode === 'FULL' && (
                        <button 
                          onClick={handlePrint}
                          className="print:hidden inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                        >
                          <Printer className="w-4 h-4" /> Print Gradesheet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .shadow-xl, .shadow-sm, .shadow-md { box-shadow: none !important; }
          .border, .border-slate-200 { border-color: #e2e8f0 !important; }
        }
      `}</style>
      
      <Footer className="print:hidden" />
    </div>
  );
}
