import React, { useState, useEffect } from 'react';
import { GraduationCap, Upload, Save, Edit3, Check } from 'lucide-react';

export default function SchoolScholarshipHero() {
    const [title, setTitle] = useState("Scholarship Programs");
    const [subtitle, setSubtitle] = useState("Recognizing academic merit and providing financial aid to aspiring students.");
    const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cms_school_scholarship_hero');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.title) setTitle(data.title);
            if (data.subtitle) setSubtitle(data.subtitle);
            if (data.bgImage) setBgImage(data.bgImage);
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBgImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        localStorage.setItem('cms_school_scholarship_hero', JSON.stringify({ title, subtitle, bgImage }));
        window.dispatchEvent(new Event('local-storage-update'));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/60">
            <div className="border-b border-slate-100 pb-5 mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-emerald-600" />
                        School - Scholarship Hero Section
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage banner for the Scholarship page.</p>
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
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Hero Background Image</label>
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 aspect-video bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center">
                        {bgImage ? (
                            <img src={bgImage} alt="Scholarship Hero" className="w-full h-full object-cover" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-400" />
                        )}
                        <label htmlFor="school-scholarship-hero" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm font-bold">Change Background Image</span>
                        </label>
                        <input id="school-scholarship-hero" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Heading</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium text-slate-700 bg-slate-50 focus:bg-white transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Subtitle</label>
                        <textarea 
                            rows={4} 
                            value={subtitle} 
                            onChange={(e) => setSubtitle(e.target.value)} 
                            className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none font-medium text-slate-700 bg-slate-50 focus:bg-white transition-all"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
