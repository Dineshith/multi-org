import React, { useState } from 'react';
import { galleryItems } from './galleryData';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Plus2Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Achievements', 'Notice', 'Events', 'Sports', 'Facilities'];

  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-12" id="gallery-grid">
      <div className="max-w-7xl mx-auto">
        
      
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#051087] text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? `All (${galleryItems.length})` : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group cursor-pointer flex flex-col transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_24px_rgba(5,16,135,0.15)] group-hover:-translate-y-1.5 transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/90 text-[#051087] flex items-center justify-center shadow">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3.5 text-[1.125rem] sm:text-[1.2rem] font-bold text-gray-950 tracking-tight leading-snug group-hover:text-[#051087] transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50">
            <X className="w-7 h-7" />
          </button>
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50">
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl w-full bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img src={filteredItems[selectedImage]?.image} alt={filteredItems[selectedImage]?.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-5 sm:p-6 bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{filteredItems[selectedImage]?.title}</h2>
                <p className="text-sm text-neutral-300 mt-1 max-w-xl">{filteredItems[selectedImage]?.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}