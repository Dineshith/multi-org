import React from 'react';
import GalleryHero from '../components/GalleryHero';
import GalleryGrid from '../components/GalleryGrid';
import Footer from '../components/Footer';

const Gallery = () => {
  return (
    <div className="w-full bg-white">
      <GalleryHero />
      <GalleryGrid />
      <Footer />
    </div>
  );
};

export default Gallery;