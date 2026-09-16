import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import WhatWeOffer from '../components/WhatWeOffer';
import About from '../components/About';
import NewsUpdates from '../components/NewsUpdates';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <NoticeBoard />
        <WhatWeOffer />
        <About />
        <NewsUpdates />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
