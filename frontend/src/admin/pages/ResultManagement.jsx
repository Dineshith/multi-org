import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, FileImage } from 'lucide-react';

const inputCls = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1";

export default function ResultManagement() {
  const [activeTab, setActiveTab] = useState('upload');
  const [publishedResults, setPublishedResults] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [examName, setExamName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || !examName || !imagePreview) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const newResult = {
      id: Date.now(),
      title,
      examName,
      imagePreview,
      date: new Date().toLocaleDateString()
    };

    setPublishedResults([newResult, ...publishedResults]);
    setTitle('');
    setExamName('');
    setImagePreview(null);
    alert("Result published successfully!");
    setActiveTab('published');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      setPublishedResults(publishedResults.filter(r => r.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Result Management</h3>
        <p className="text-slate-500 mt-1">Upload and publish exam result images directly.</p>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Upload className="w-4 h-4" /> Upload Result
        </button>
        <button 
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'published' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FileImage className="w-4 h-4" /> Published Results ({publishedResults.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Publish New Result
            </h4>
            <form onSubmit={handlePublish} className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Result Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Class 10 Final Results" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Exam/Terminal Name</label>
                <input 
                  type="text" 
                  value={examName} 
                  onChange={(e) => setExamName(e.target.value)} 
                  placeholder="e.g. Second Terminal Examination 2080" 
                  className={inputCls} 
                />
              </div>
              
              <div>
                <label className={labelCls}>Result Image</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <CheckCircle2 className="w-5 h-5" /> Publish Result Image
              </button>
            </form>
          </div>
        )}

        {activeTab === 'published' && (
          <div>
             <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-blue-600" /> All Published Results
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
                        <button 
                          onClick={() => handleDelete(res.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                          title="Delete Result"
                        >
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
