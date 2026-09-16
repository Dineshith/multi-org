import React from 'react';
import { LayoutDashboard, Upload, Save, Edit3 } from 'lucide-react';

export default function ResearchHero() {
    return (
        <div className="p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="border-b border-slate-100 pb-5 mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                        Research Page - Hero Section
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage the hero section for the Research & Development page.</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Hero Background Image</label>
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 aspect-video bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                            <Upload className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Click to upload new image</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Main Heading (Title)</label>
                        <div className="relative">
                            <input type="text" defaultValue="Pioneering Research & Innovation" className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-slate-700 bg-slate-50 focus:bg-white transition-all" />
                            <Edit3 className="absolute right-4 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
