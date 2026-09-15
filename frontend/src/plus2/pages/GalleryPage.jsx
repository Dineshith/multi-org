import React from 'react';
import Plus2Gallery from '../component/Plus2Gallery';

export default function GalleryPage() {
  return (
    <div className="w-full bg-gray-50">
    
      <div className="relative w-full h-64 md:h-80 bg-gray-900 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600" 
          alt="Gallery Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-md">
          Our Gallery
        </h1>
      </div>


      <Plus2Gallery />
    </div>
  );
}