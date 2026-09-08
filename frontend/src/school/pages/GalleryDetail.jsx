import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { galleryData } from '../components/galleryData';
import Footer from '../components/Footer';

const GalleryDetail = () => {
  const { id } = useParams();
  const image = galleryData.find(img => img.id === id);

  if (!image) {
    return <div className="text-center py-20 text-2xl font-bold bg-white min-h-screen">Image not found!</div>;
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <div className="flex-grow py-16 px-8 md:px-24 max-w-5xl mx-auto w-full">
        
        <Link to="/school/gallery" className="text-[#da251c] font-semibold hover:underline mb-8 inline-block">
          &larr; Back to Gallery
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <img 
            src={image.src} 
            alt={image.caption} 
            className="w-full max-h-[70vh] object-cover"
          />
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#0c1a30] mb-4">{image.caption}</h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {image.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-gray-200 text-[15px] text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#da251c]">Photographer:</span> {image.photographer}
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#da251c]">Date:</span> {image.date}
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default GalleryDetail;