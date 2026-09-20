import React, { useState, useEffect } from 'react';
import { Info, Upload, Save, Check } from 'lucide-react';

export default function SchoolAboutContent() {
  const [data, setData] = useState({
    tag: 'Who We Are',
    title: 'About Akshar',
    description: 'It is a matter of great honor for the Akshar family that Vishwa Adarsha college, Itahari, has stepped into the 28 years of the glorious march towards imparting quality education to the students, particularly in the Eastern region of Nepal.',
    experienceYears: '8 +',
    experienceLabel: 'Years Experience',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_about_content');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('cms_school_about_content', JSON.stringify(data));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/60">
      <div className="border-b border-slate-100 pb-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-6 h-6 text-emerald-600" />
            School - About Section Content
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage the story, experience badge, and featured image for About School.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Image Preview & Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">Featured Section Image</label>
          <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 aspect-[4/3] bg-slate-50 flex items-center justify-center">
            {data.image ? (
              <img src={data.image} alt="About preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-slate-300" />
            )}
            <label htmlFor="school-about-img" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">Upload Image</span>
            </label>
            <input id="school-about-img" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Badge Value</label>
              <input
                type="text"
                name="experienceYears"
                value={data.experienceYears}
                onChange={handleChange}
                placeholder="e.g. 8 +"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Badge Label</label>
              <input
                type="text"
                name="experienceLabel"
                value={data.experienceLabel}
                onChange={handleChange}
                placeholder="Years Experience"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Small Tagline</label>
            <input
              type="text"
              name="tag"
              value={data.tag}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Section Headline</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description Paragraph</label>
            <textarea
              rows={6}
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
