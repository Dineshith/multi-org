import React from 'react';
import { ImagePlus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

export default function HomeGallery() {
    return (
        <div className="p-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ImagePlus className="w-6 h-6 text-blue-500" />
                        Main Portal - Photo Gallery
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Upload and manage static images for the main gallery section.</p>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Photos
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 aspect-[4/3] flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-bold">Add Image</span>
                </div>
                {[1, 2, 3, 4, 5].map(img => (
                    <div key={img} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm">
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <button className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 hover:scale-110 transition-all shadow-sm" title="Delete Image">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                            <ImageIcon className="w-10 h-10 opacity-50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
