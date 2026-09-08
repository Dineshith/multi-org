import React from 'react';
import { Link } from 'react-router-dom';
import { galleryData } from './galleryData';

const GalleryGrid = () => {
  return (
    <div className="bg-white py-20 px-8 md:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {galleryData.map((item) => (
            <Link 
              to={`/school/gallery/${item.id}`} 
              key={item.id} 
              className="relative overflow-hidden group cursor-pointer aspect-square rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgb(12,26,48,0.2)] transition-all duration-300 block"
            >
              <img 
                src={item.src} 
                alt={item.caption} 
                /* सुरुमा grayscale, hover गर्दा colorful */
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
              />
              {/* तस्बिर माथि देखिने क्याप्सन */}
              <div className="absolute top-4 left-4 bg-white/90 text-[#0c1a30] font-bold px-3 py-1 rounded-md text-[13px] tracking-wide shadow-sm">
                {item.caption}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryGrid;