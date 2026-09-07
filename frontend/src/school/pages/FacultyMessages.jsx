import React from 'react';
import FacultyHero from '../components/Message';
import FacultyMessagesList from '../components/FacultyMessagesList';
import Footer from '../components/Footer';

const FacultyMessages = () => {
  return (
    <div className="w-full bg-white">
      <FacultyHero />
      <FacultyMessagesList />
      <Footer />
    </div>
  );
};

export default FacultyMessages;