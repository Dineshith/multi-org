import React from 'react';
import TeachersHero from '../components/TeachersHero';
import TeachersList from '../components/TeachersList';
import Footer from '../components/Footer';

const Teachers = () => {
  return (
    <div className="w-full bg-white">
      <TeachersHero />
      <TeachersList />
      <Footer />
    </div>
  );
};

export default Teachers;