import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Link as LinkIcon, Building2, Check } from 'lucide-react';

export default function SchoolFooter() {
  const [formData, setFormData] = useState({
    brandName: 'अक्षर (Akshar School)',
    address: 'Aaitabare-Itahari, Sunsari',
    email: 'akshar@gmail.com',
    phone: '9842108899',
    faculties: 'Science, IT, Management',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.6223425417024!2d87.2742654752152!3d26.660571676798227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6d8b1d73da1d%3A0xd4d57514869ca946!2sLunar%20IT%20Solution%20Pvt.%20Ltd.!5e0!3m2!1sen!2sno!4v1788074468924!5m2!1sen!2sno'
  });
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('cms_school_footer');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('cms_school_footer', JSON.stringify(formData));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const inputCls = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">School Footer Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage school contact details, address, faculties, and map displayed in footer.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand & Contact Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Basic Information</h3>
            
            <div>
              <label className={labelCls}>
                <Building2 className="w-4 h-4 text-emerald-600" />
                School Display Name
              </label>
              <input 
                type="text" 
                name="brandName" 
                value={formData.brandName} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="e.g. Akshar School"
              />
            </div>

            <div>
              <label className={labelCls}>
                <MapPin className="w-4 h-4 text-emerald-500" />
                Physical Address
              </label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="e.g. Aaitabare-Itahari, Sunsari"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <Mail className="w-4 h-4 text-orange-500" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={inputCls} 
                  placeholder="akshar@gmail.com"
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Phone className="w-4 h-4 text-purple-500" />
                  Phone Number
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className={inputCls} 
                  placeholder="e.g. 9842108899"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Faculties (Comma separated)
              </label>
              <input 
                type="text" 
                name="faculties" 
                value={formData.faculties} 
                onChange={handleChange} 
                className={inputCls} 
                placeholder="Science, IT, Management"
              />
            </div>
          </div>

          {/* Map Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Location Map</h3>
            
            <div>
              <label className={labelCls}>
                <LinkIcon className="w-4 h-4 text-slate-500" />
                Google Maps Embed URL
              </label>
              <textarea 
                name="mapUrl" 
                value={formData.mapUrl} 
                onChange={handleChange} 
                className={`${inputCls} h-24 resize-none`} 
                placeholder="Paste the Google Maps Embed src URL here..."
              ></textarea>
              <p className="text-xs text-slate-400 mt-2">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy src URL.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Map Preview</h4>
              <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                {formData.mapUrl ? (
                  <iframe
                    title="Map Preview"
                    src={formData.mapUrl}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No map URL provided</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
