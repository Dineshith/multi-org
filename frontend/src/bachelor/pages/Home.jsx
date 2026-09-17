import React from 'react';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import WhatWeOffer from '../components/WhatWeOffer';
import About from '../components/About';
import NewsUpdates from '../components/NewsUpdates';
import Testimonials from '../components/Testimonials';

// Navbar and Footer are rendered by the shared wrapper in App.jsx
const Home = () => {
  return (
    <div className="w-full bg-white text-gray-900 font-sans">
      <Hero />
      <NoticeBoard />
      <WhatWeOffer />
      <About />
      <NewsUpdates />
      <Testimonials />
    </div>
  );
};

export default Home;
