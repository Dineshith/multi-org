import React from 'react';
import ScholarshipHero from '../components/ScholarshipHero';
import ScholarshipList from '../components/ScholarshipList';
import Footer from '../components/Footer';

const Scholarship = () => {
  return (
    <div className="w-full bg-white">
      <ScholarshipHero />
      <ScholarshipList />
      <Footer />
    </div>
  );
};

export default Scholarship;