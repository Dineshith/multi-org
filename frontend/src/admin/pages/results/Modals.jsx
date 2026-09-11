import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Trash2, CheckCircle2, FileImage, Settings, Edit3, TableProperties, Plus, Download, FileSpreadsheet, X, Info, AlertCircle, Check, ArrowLeft, AlertTriangle } from 'lucide-react';
import { ORG_INFO } from '../../config/orgConfig';

// --- Grading System Logic (NEB Standard) ---
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

// =============================================
// IMPORT MARKS CSV MODAL
// =============================================
function ImportMarksCSVModal({ onClose, onImport, entryWing, entryProgram, entryLevel, entryTerminal, subjects, classStudents, existingSymbols = {} }) {
  const [step, setStep] = useState(1);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  // ---- Download Pre-filled Template ----
  const downloadTemplate = () => {
    const headers = ['Student ID', 'Roll Number', 'Full Name', 'Symbol Number', ...subjects.map(s => `${s.name} (FM: ${s.fullMarks})`)];
    
    const rows = classStudents.map(student => {
      return [
        student.id,
        student.roll || '',
        student.name || '',
        '', // Symbol Number (to be filled)
        ...subjects.map(() => '') // Blank marks (to be filled)
      ];
    });

    const csvContent = [
      `# Marks Template for: ${entryWing} > ${entryLevel} > ${entryTerminal}`,
      `# Do not change the Student ID or header columns!`,
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_${entryLevel.replace(/\s+/g, '_')}_${entryTerminal.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- Parse uploaded file ----
  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a .csv file.']);
      return;
    }
    setFileName(file.name);

    // Dynamic Header Names
    const subjectHeaders = subjects.map(s => `${s.name} (FM: ${s.fullMarks})`);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      comments: '#',
      complete: (results) => {
        const mapped = results.data.map((row, i) => {
          const studentId = row['Student ID'];
          const symbolNum = row['Symbol Number'] || '';
          const marks = {};
          
          subjects.forEach(sub => {
            const headerName = `${sub.name} (FM: ${sub.fullMarks})`;
            marks[sub.id] = row[headerName] !== undefined ? row[headerName].trim() : '';
          });

          return { rowNum: i + 1, studentId, name: row['Full Name'], symbolNum, marks };
        });

        // Validation
        const allErrors = [];
        const studentIdsInClass = new Set(classStudents.map(s => s.id));

        // ---- Duplicate detection within the CSV itself ----
        const csvStudentIdsSeen = new Map();
        const csvSymbolsSeen = new Map();

        // Build map of existing symbol numbers in the DB for this class/terminal (symbol -> studentId)
        const existingSymbolMap = new Map();
        Object.entries(existingSymbols).forEach(([key, val]) => {
          if (key.startsWith(`${entryLevel}-${entryTerminal}-`) && val) {
            const stId = key.split('-').slice(2).join('-');
            existingSymbolMap.set(val, stId);
          }
        });

        mapped.forEach(row => {
          if (!row.studentId) {
            allErrors.push(`Row ${row.rowNum}: Missing Student ID.`);
          } else if (!studentIdsInClass.has(row.studentId)) {
            allErrors.push(`Row ${row.rowNum}: Student ID "${row.studentId}" does not belong to this class.`);
          } else {
            // Duplicate Student ID within CSV
            if (csvStudentIdsSeen.has(row.studentId)) {
              const firstRow = csvStudentIdsSeen.get(row.studentId);
              allErrors.push(`Row ${row.rowNum}: Duplicate Student ID "${row.studentId}" — same as Row ${firstRow} in this file.`);
              allErrors.push(`Row ${firstRow}: Duplicate Student ID "${row.studentId}" — same as Row ${row.rowNum} in this file.`);
            } else {
              csvStudentIdsSeen.set(row.studentId, row.rowNum);
            }
          }

          // Duplicate Symbol Number within CSV & Database
          if (row.symbolNum) {
            const symbolKey = row.symbolNum.trim();
            if (csvSymbolsSeen.has(symbolKey)) {
              const firstRow = csvSymbolsSeen.get(symbolKey);
              allErrors.push(`Row ${row.rowNum}: Duplicate Symbol Number "${symbolKey}" — same as Row ${firstRow} in this file.`);
              allErrors.push(`Row ${firstRow}: Duplicate Symbol Number "${symbolKey}" — same as Row ${row.rowNum} in this file.`);
            } else {
              csvSymbolsSeen.set(symbolKey, row.rowNum);
            }

            // Check against existing database for other students
            if (existingSymbolMap.has(symbolKey) && existingSymbolMap.get(symbolKey) !== row.studentId) {
              allErrors.push(`Row ${row.rowNum}: Symbol Number "${symbolKey}" is already assigned to another student in this exam.`);
            }
          }

          // Validate Marks
          subjects.forEach(sub => {
            const markStr = row.marks[sub.id];
            if (markStr !== '') {
              const markVal = Number(markStr);
              if (isNaN(markVal)) {
                allErrors.push(`Row ${row.rowNum}: Mark for ${sub.name} must be a number.`);
              } else if (markVal > sub.fullMarks) {
                allErrors.push(`Row ${row.rowNum}: Mark for ${sub.name} (${markVal}) exceeds Full Marks (${sub.fullMarks}).`);
              } else if (markVal < 0) {
                allErrors.push(`Row ${row.rowNum}: Mark for ${sub.name} cannot be negative.`);
              }
            }
          });
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
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = () => {
    const importedMarks = {};
    const importedSymbols = {};

    parsedData.forEach(row => {
      if (!row.studentId) return;
      
      // Symbol
      if (row.symbolNum) {
        importedSymbols[`${entryLevel}-${entryTerminal}-${row.studentId}`] = row.symbolNum;
      }
      
      // Marks
      subjects.forEach(sub => {
        const markVal = row.marks[sub.id];
        if (markVal !== '') {
          importedMarks[`${entryLevel}-${entryTerminal}-${row.studentId}-${sub.id}`] = markVal;
        }
      });
    });

    onImport(importedMarks, importedSymbols);
  };

  const invalidRowIndices = new Set();
  errors.forEach(err => {
    const match = err.match(/^Row (\d+):/);
    if (match) invalidRowIndices.add(parseInt(match[1]) - 1);
  });
  const validRowsCount = parsedData.length - invalidRowIndices.size;

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
              <h3 className="text-xl font-bold text-slate-800">Import Marks</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {entryLevel} › {entryTerminal}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-bold">How to use:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>Download the pre-filled template for this class.</li>
                      <li>It contains all active students. Just fill in the <strong>Symbol Number</strong> and <strong>Marks</strong>.</li>
                      <li><strong>Do not change the Student ID or header columns!</strong></li>
                      <li>Save and upload the CSV file here.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Template Download */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Download Pre-filled Template</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Contains {classStudents.length} students and {subjects.length} subjects.</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  <Download className="w-4 h-4" /> Download .csv
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-emerald-400 bg-emerald-50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isDragging ? 'bg-emerald-200' : 'bg-slate-100'
                }`}>
                  <Upload className={`w-7 h-7 ${isDragging ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <p className="text-slate-700 font-bold text-lg">Drag & drop your filled CSV here</p>
                <p className="text-slate-400 text-sm mt-1">or <span className="text-emerald-600 font-semibold underline">click to browse</span></p>

                {errors.length > 0 && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                    {errors.map((e, i) => (
                      <p key={i} className="text-red-600 text-sm flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> {e}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{validRowsCount} valid</span>
                </div>
                {invalidRowIndices.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-red-700">{invalidRowIndices.size} with errors</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-auto">Rows with errors will be <strong>skipped</strong>.</span>
              </div>

              {/* Error details */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Validation Errors</p>
                  <div className="space-y-1">
                    {errors.map((e, i) => <p key={i} className="text-xs text-red-600 font-medium">• {e}</p>)}
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
                        <th className="p-3">Name</th>
                        <th className="p-3">Symbol</th>
                        {subjects.map(s => <th key={s.id} className="p-3">{s.name}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.map((row, i) => {
                        const isInvalid = invalidRowIndices.has(i);
                        return (
                          <tr key={i} className={isInvalid ? 'bg-red-50/60' : 'hover:bg-slate-50'}>
                            <td className="p-3 font-mono text-slate-400">{row.rowNum}</td>
                            <td className="p-3">
                              {isInvalid
                                ? <span className="flex items-center gap-1 text-red-600 font-bold"><AlertCircle className="w-3 h-3" /> Error</span>
                                : <span className="flex items-center gap-1 text-emerald-600 font-bold"><Check className="w-3 h-3" /> OK</span>
                              }
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                            <td className="p-3 text-slate-600">{row.symbolNum || '—'}</td>
                            {subjects.map(sub => (
                              <td key={sub.id} className="p-3 text-slate-600">{row.marks[sub.id] || '—'}</td>
                            ))}
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
              <button onClick={() => { setStep(1); setParsedData([]); setErrors([]); setFileName(''); }} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleImport} disabled={validRowsCount === 0} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Check className="w-4 h-4" /> Import {validRowsCount} Rows
                </button>
              </div>
            </>
          ) : (
            <>
              <div />
              <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================
// MARK SHEET / GRADE SHEET MODAL
// =============================================
function MarkSheetModal({ student, onClose, entryWing, entryProgram, entryLevel, entryTerminal, subjects, studentMarks, symbolNumbers }) {
  const symbolKey = `${entryLevel}-${entryTerminal}-${student.id}`;
  const symbolVal = symbolNumbers[symbolKey] || 'N/A';

  // Calculate results
  let totalFull = 0;
  let totalObtained = 0;
  let totalGP = 0;
  let creditSum = 0; // Simplified: Assuming equal credit hours for all subjects for GPA calculation

  const results = subjects.map(sub => {
    const key = `${entryLevel}-${entryTerminal}-${student.id}-${sub.id}`;
    const markStr = studentMarks[key];
    const obtained = Number(markStr);
    
    totalFull += sub.fullMarks;
    totalObtained += (isNaN(obtained) ? 0 : obtained);
    
    const { grade, gp, remarks } = calculateGrade(markStr, sub.fullMarks);
    if (gp !== '-') {
      totalGP += gp;
      creditSum += 1;
    }

    return {
      name: sub.name,
      fullMarks: sub.fullMarks,
      passMarks: sub.passMarks,
      obtained: markStr !== '' && markStr !== undefined ? obtained : '-',
      grade,
      gp,
      remarks
    };
  });

  const hasNG = results.some(r => r.grade === 'NG' || r.grade === '-');
  const finalGPA = hasNG ? '0.00' : (creditSum > 0 ? (totalGP / creditSum).toFixed(2) : '0.00');
  const finalGradeResult = hasNG ? 'NG' : (
    finalGPA >= 3.6 ? 'A+' :
    finalGPA >= 3.2 ? 'A' :
    finalGPA >= 2.8 ? 'B+' :
    finalGPA >= 2.4 ? 'B' :
    finalGPA >= 2.0 ? 'C+' :
    finalGPA >= 1.6 ? 'C' : 'D'
  );

  const handlePrint = () => {
    const printContents = document.getElementById('marksheet-print-area');
    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${student.name} - Grade Sheet</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            * { box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; color: #1e293b; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .sheet-container { border: 4px solid #1e3a8a; padding: 30px; border-radius: 8px; position: relative; min-height: 260mm; background: white; }
            
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; }
            .school-name { font-size: 32px; font-weight: bold; color: #1e3a8a; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
            .school-address { font-size: 16px; margin: 0 0 5px 0; }
            .school-contact { font-size: 14px; margin: 0; color: #475569; }
            .sheet-title { font-size: 22px; font-weight: bold; background: #1e3a8a; color: white; display: inline-block; padding: 8px 25px; border-radius: 50px; margin-top: 15px; letter-spacing: 2px; }
            
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; font-size: 15px; }
            .info-row { display: flex; align-items: baseline; }
            .info-label { font-weight: bold; width: 120px; flex-shrink: 0; }
            .info-value { flex: 1; border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; text-transform: uppercase; font-weight: bold; color: #0f172a; }
            
            .marks-table { border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            .marks-table th { border: 1px solid #1e3a8a; padding: 12px 8px; background: #eff6ff; font-size: 14px; color: #1e3a8a; text-transform: uppercase; }
            .marks-table td { border: 1px solid #94a3b8; padding: 10px 8px; text-align: center; font-size: 14px; font-weight: bold; }
            .marks-table td.sub-name { text-align: left; }
            
            .summary-section { margin-top: 30px; display: flex; justify-content: space-between; border: 2px solid #1e3a8a; padding: 15px; background: #eff6ff; border-radius: 8px; }
            .summary-box { text-align: center; }
            .summary-label { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 5px; }
            .summary-value { font-size: 24px; font-weight: 900; color: #1e3a8a; }
            
            .signatures { display: flex; justify-content: space-between; margin-top: 80px; padding: 0 30px; }
            .sig-line { text-align: center; font-weight: bold; font-size: 14px; width: 200px; border-top: 1px solid #1e293b; padding-top: 5px; }
            
            .grading-scale { margin-top: 40px; font-size: 11px; width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; }
            .grading-scale th, .grading-scale td { border: 1px solid #cbd5e1; padding: 4px; text-align: center; }
            .grading-scale th { background: #f8fafc; }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Grade Sheet Preview</h3>
              <p className="text-sm text-slate-500">{student.name} • {entryTerminal}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95">
              <TableProperties className="w-4 h-4" /> Print A4
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Printable Area Container */}
        <div className="p-8 overflow-y-auto max-h-[75vh] bg-slate-100/50">
          <div id="marksheet-print-area" className="bg-white shadow-sm border border-slate-200 mx-auto" style={{ maxWidth: '210mm' }}>
            <div className="sheet-container" style={{ border: '4px solid #1e3a8a', padding: '30px', borderRadius: '8px', position: 'relative', minHeight: '1000px', backgroundColor: '#fff', fontFamily: "'Times New Roman', serif", color: '#1e293b' }}>
              
              {/* Mark Sheet Header */}
              <div className="header" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1e3a8a', paddingBottom: '20px' }}>
                <h1 className="school-name" style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{ORG_INFO.name}</h1>
                <p className="school-address" style={{ fontSize: '16px', margin: '0 0 5px 0' }}>{ORG_INFO.address}</p>
                <p className="school-contact" style={{ fontSize: '14px', margin: '0', color: '#475569' }}>Phone: {ORG_INFO.phone} | Email: {ORG_INFO.email}</p>
                <div className="sheet-title" style={{ fontSize: '22px', fontWeight: 'bold', background: '#1e3a8a', color: 'white', display: 'inline-block', padding: '8px 25px', borderRadius: '50px', marginTop: '15px', letterSpacing: '2px' }}>GRADE SHEET</div>
                <p style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase' }}>{entryTerminal} - {ORG_INFO.currentSession}</p>
              </div>

              {/* Student Details */}
              <div className="student-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', fontSize: '15px' }}>
                <div className="info-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="info-label" style={{ fontWeight: 'bold', width: '120px', flexShrink: 0 }}>Name:</span>
                  <span className="info-value" style={{ flex: 1, borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: '#0f172a' }}>{student.name}</span>
                </div>
                <div className="info-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="info-label" style={{ fontWeight: 'bold', width: '120px', flexShrink: 0 }}>Roll No:</span>
                  <span className="info-value" style={{ flex: 1, borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: '#0f172a' }}>{student.roll}</span>
                </div>
                <div className="info-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="info-label" style={{ fontWeight: 'bold', width: '120px', flexShrink: 0 }}>Class/Level:</span>
                  <span className="info-value" style={{ flex: 1, borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: '#0f172a' }}>{entryLevel} ({entryProgram})</span>
                </div>
                <div className="info-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="info-label" style={{ fontWeight: 'bold', width: '120px', flexShrink: 0 }}>Symbol No:</span>
                  <span className="info-value" style={{ flex: 1, borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: '#0f172a' }}>{symbolVal}</span>
                </div>
                <div className="info-row" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="info-label" style={{ fontWeight: 'bold', width: '120px', flexShrink: 0 }}>Date of Birth:</span>
                  <span className="info-value" style={{ flex: 1, borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: '#0f172a' }}>{student.dob || '—'}</span>
                </div>
              </div>

              {/* Marks Table */}
              <table className="marks-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '50px' }}>S.N.</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', textAlign: 'left' }}>Subjects</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '80px' }}>FM</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '80px' }}>PM</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '100px' }}>Obtained</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '80px' }}>Grade</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase', width: '80px' }}>GP</th>
                    <th style={{ border: '1px solid #1e3a8a', padding: '12px 8px', background: '#eff6ff', fontSize: '14px', color: '#1e3a8a', textTransform: 'uppercase' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{i + 1}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>{r.name}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.fullMarks}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.passMarks}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.obtained}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.grade}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.gp}</td>
                      <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{r.remarks}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan="2" style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>TOTAL</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{totalFull}</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>—</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a' }}>{totalObtained}</td>
                    <td colSpan="3" style={{ border: '1px solid #94a3b8', padding: '10px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}></td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Section */}
              <div className="summary-section" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', border: '2px solid #1e3a8a', padding: '15px 30px', background: '#eff6ff', borderRadius: '8px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div className="summary-box" style={{ textAlign: 'center' }}>
                  <div className="summary-label" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', marginBottom: '5px' }}>Grade Point Average (GPA)</div>
                  <div className="summary-value" style={{ fontSize: '24px', fontWeight: 900, color: '#1e3a8a' }}>{finalGPA}</div>
                </div>
                <div className="summary-box" style={{ textAlign: 'center' }}>
                  <div className="summary-label" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', marginBottom: '5px' }}>Final Grade</div>
                  <div className="summary-value" style={{ fontSize: '24px', fontWeight: 900, color: '#1e3a8a' }}>{finalGradeResult}</div>
                </div>
                <div className="summary-box" style={{ textAlign: 'center' }}>
                  <div className="summary-label" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', marginBottom: '5px' }}>Result Status</div>
                  <div className="summary-value" style={{ fontSize: '24px', fontWeight: 900, color: hasNG ? '#ef4444' : '#16a34a' }}>{hasNG ? 'NOT GRADED' : 'PASSED'}</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="signatures" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', padding: '0 30px' }}>
                <div className="sig-line" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', width: '200px', borderTop: '1px solid #1e293b', paddingTop: '5px' }}>
                  <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>Date of Issue: {new Date().toLocaleDateString()}</p>
                  Class Teacher
                </div>
                <div className="sig-line" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', width: '200px', borderTop: '1px solid #1e293b', paddingTop: '5px' }}>
                  <p style={{ margin: 0, fontSize: '10px', color: 'transparent' }}>.</p>
                  Principal
                </div>
              </div>

              {/* Grading Legend */}
              <div style={{ marginTop: '50px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Grading Scale:</p>
                <table className="grading-scale" style={{ marginTop: '5px', fontSize: '10px', width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>Interval in %</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>90-100</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>80-89</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>70-79</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>60-69</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>50-59</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>40-49</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>35-39</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', background: '#f8fafc' }}>Below 35</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Grade</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>A+</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>A</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>B+</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>B</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>C+</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>C</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>D</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold', color: '#ef4444' }}>NG</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Grade Point</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>4.0</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>3.6</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>3.2</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>2.8</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>2.4</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>2.0</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>1.6</td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export { ImportMarksCSVModal, MarkSheetModal };
