import React, { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Phone, Mail, Globe, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
const DEFAULT_ORG_INFO = { name: 'Institute Name', address: 'Institute Address', phone: '', email: '', website: '', established: '', panNo: '', logo: null, currentSession: '2081/2082' };

const loadData = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export default function InstutiteDetails() {
  const [formData, setFormData] = useState(() => loadData('multi_org_institute_details', DEFAULT_ORG_INFO));
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('multi_org_institute_details', JSON.stringify(formData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputConfig = [
    { name: 'name', label: 'Institute Name', icon: Building2, placeholder: 'e.g. Sunrise Academy' },
    { name: 'address', label: 'Address', icon: MapPin, placeholder: 'e.g. Kathmandu, Nepal' },
    { name: 'phone', label: 'Phone', icon: Phone, placeholder: 'e.g. 01-4XXXXXX' },
    { name: 'email', label: 'Email', icon: Mail, placeholder: 'e.g. info@sunriseacademy.edu.np' },
    { name: 'website', label: 'Website', icon: Globe, placeholder: 'e.g. www.sunriseacademy.edu.np' },
    { name: 'established', label: 'Established (BS/AD)', icon: Calendar, placeholder: 'e.g. 2050 BS' },
    { name: 'panNo', label: 'PAN No.', icon: FileText, placeholder: 'e.g. 123456789' },
    { name: 'currentSession', label: 'Current Session', icon: Calendar, placeholder: 'e.g. 2081/2082' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h4 className="text-xl font-bold text-slate-800">Institute Details</h4>
          <p className="text-sm text-slate-500 mt-1">These details will be reflected on the marksheets and result portal.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
        >
          <Save className="w-4 h-4" /> Save Details
        </button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-semibold flex items-center gap-2">
          Institute details saved successfully!
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputConfig.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <field.icon className="w-3.5 h-3.5" /> {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          ))}
          
          <div className="md:col-span-2 border-t border-slate-100 mt-2 pt-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Logo Upload (Optional)
            </label>
            <div className="flex items-center gap-4">
              {formData.logo && (
                <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
