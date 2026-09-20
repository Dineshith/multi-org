import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Upload, Check } from 'lucide-react';

export default function SchoolNavbar() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [schoolName, setSchoolName] = useState('अक्षर');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('cms_school_navbar_logo');
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    const savedName = localStorage.getItem('cms_school_navbar_name');
    if (savedName) {
      setSchoolName(savedName);
    }
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (logoPreview) {
      localStorage.setItem('cms_school_navbar_logo', logoPreview);
    }
    localStorage.setItem('cms_school_navbar_name', schoolName);
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">School Navbar Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage the logo and brand branding for the school portal's navigation bar.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="max-w-xl">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">Logo & Branding</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Brand Display Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. अक्षर"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                School Logo
              </label>
              
              <div className="flex items-start gap-8">
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <span className="text-xs text-slate-400 font-medium">No Logo Selected</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <label htmlFor="school-logo-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                      <Upload className="w-6 h-6 text-white mb-1" />
                      <span className="text-xs text-white font-medium">Change</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1">
                  <input 
                    type="file" 
                    id="school-logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="school-logo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                  <p className="text-xs text-slate-500 mt-3">
                    Recommended: Transparent PNG or SVG.<br />
                    Max file size: 2MB.
                  </p>
                  {logoPreview && (
                    <button 
                      onClick={() => setLogoPreview(null)}
                      className="mt-4 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
