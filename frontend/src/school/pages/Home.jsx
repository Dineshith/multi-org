import React from 'react';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import WhatWeOffer from '../components/WhatWeOffer';
import About from '../components/About';
import NewsUpdates from '../components/NewsUpdates';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      
      <NoticeBoard />
      <WhatWeOffer />
      <About />
      <NewsUpdates />
      <Footer />
    </div>
  );
};

export default Home;