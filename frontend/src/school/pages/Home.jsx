import React from 'react';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import WhatWeOffer from '../components/WhatWeOffer';
import About from '../components/About';
import NewsUpdates from '../components/NewsUpdates';

const Home = () => {
  return (
    <div className="w-full">
      {/* माथिको हिरो सेक्सन */}
      <Hero />
      
      {/* त्यसको तल आउने अरु सबै सेक्सनहरू */}
      <NoticeBoard />
      <WhatWeOffer />
      <About />
      <NewsUpdates />
    </div>
  );
};

export default Home;