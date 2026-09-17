import React, { useState } from 'react';
import { Images, X } from 'lucide-react';

const GALLERY_KEY = 'admin_gallery_items';

const fallbackGallery = [
  { id: 'f1', category: 'Events', caption: 'Annual Day 2081', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { id: 'f2', category: 'Academic', caption: 'Graduation Ceremony', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80' },
  { id: 'f3', category: 'Sports', caption: 'Sports Day Highlights', src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80' },
  { id: 'f4', category: 'Cultural', caption: 'Cultural Night 2080', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
  { id: 'f5', category: 'Infrastructure', caption: 'Computer Lab', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80' },
  { id: 'f6', category: 'Academic', caption: 'Library Reading Hall', src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80' },
  { id: 'f7', category: 'Events', caption: 'Freshers\' Party 2081', src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80' },
  { id: 'f8', category: 'Sports', caption: 'Cricket Tournament', src: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80' },
];

const CATEGORIES = ['All', 'Events', 'Sports', 'Cultural', 'Academic', 'Infrastructure', 'General'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  // Load from admin gallery, fallback to sample
  const adminItems = (() => {
    try {
      const data = localStorage.getItem(GALLERY_KEY);
      const parsed = data ? JSON.parse(data) : [];
      return parsed.length > 0 ? parsed : fallbackGallery;
    } catch { return fallbackGallery; }
  })();

  const filtered = selectedCategory === 'All'
    ? adminItems
    : adminItems.filter(i => i.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Memories</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Photo Gallery</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Glimpses of college life, events, and achievements that make us proud.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry-style Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16 pt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Images className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">No images in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setLightboxImg(item)}
                className={`group relative rounded-2xl overflow-hidden bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all ${
                  i % 7 === 0 || i % 7 === 4 ? 'md:row-span-2' : ''
                }`}
                style={{ aspectRatio: (i % 7 === 0 || i % 7 === 4) ? '3/4' : '4/3' }}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-white font-semibold text-sm">{item.caption}</span>
                  <span className="text-white/70 text-xs mt-0.5">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxImg(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg.src} alt={lightboxImg.caption} className="w-full h-full object-contain max-h-[80vh]" />
            <div className="bg-black/80 text-white text-center py-3 px-5">
              <p className="font-semibold">{lightboxImg.caption}</p>
              <p className="text-white/60 text-sm">{lightboxImg.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
