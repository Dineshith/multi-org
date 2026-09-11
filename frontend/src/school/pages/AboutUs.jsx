import React from 'react';
import AboutHero from '../components/AboutHero';
import IntroducingAkshar from '../components/IntroducingAkshar';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="w-full bg-white">
      <AboutHero />
      <IntroducingAkshar />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default AboutUs;