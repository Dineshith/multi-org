import React from 'react';
import AdministratorsHero from '../components/AdministratorsHero';
import AdministratorsList from '../components/AdministratorsList';
import Footer from '../components/Footer';

const Administrators = () => {
  return (
    <div className="w-full bg-white">
      <AdministratorsHero />
      <AdministratorsList />
      <Footer />
    </div>
  );
};

export default Administrators;