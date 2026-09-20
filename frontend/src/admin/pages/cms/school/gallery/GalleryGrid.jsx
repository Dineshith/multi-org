import React, { useState, useEffect } from 'react';
import { ImagePlus, Upload, Trash2, Image as ImageIcon, Save, Check } from 'lucide-react';

export default function SchoolGalleryGrid() {
  const defaultImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', title: 'Sports Day' },
    { id: 2, url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', title: 'Classroom' },
    { id: 3, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', title: 'Annual Function' },
    { id: 4, url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', title: 'Science Exhibition' },
    { id: 5, url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', title: 'Cultural Dance' }
  ];

  const [images, setImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cms_school_gallery_grid');
    if (saved) {
      setImages(JSON.parse(saved));
    } else {
      setImages(defaultImages);
    }
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem('cms_school_gallery_grid', JSON.stringify(list));
    window.dispatchEvent(new Event('local-storage-update'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => {
            const updated = [...prev, { id: Date.now() + Math.random(), url: reader.result, title: file.name.split('.')[0] }];
            saveToStorage(updated);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDelete = (id) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    saveToStorage(updated);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/60">
      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ImagePlus className="w-6 h-6 text-emerald-600" />
            School - Photo Gallery Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Upload, arrange, and manage photos for the school gallery.</p>
        </div>
        <div>
          <input
            type="file"
            id="school-gallery-multi-upload"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <label
            htmlFor="school-gallery-multi-upload"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Photos
          </label>
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 mb-6 text-sm font-semibold flex items-center gap-2 rounded-xl border border-emerald-100">
          <Check className="w-4 h-4" /> Gallery updated!
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <label
          htmlFor="school-gallery-multi-upload"
          className="rounded-2xl border-2 border-dashed border-slate-200 aspect-[4/3] flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
        >
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-sm font-bold">Add Images</span>
        </label>

        {images.map((img) => (
          <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm">
            <img src={img.url} alt={img.title || "Gallery"} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
              <span className="text-white text-xs font-semibold px-2 text-center line-clamp-1">{img.title}</span>
              <button
                onClick={() => handleDelete(img.id)}
                className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 hover:scale-110 transition-all shadow-sm"
                title="Delete Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
