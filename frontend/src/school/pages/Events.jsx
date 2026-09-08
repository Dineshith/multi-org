import React from 'react';
import EventsHero from '../components/EventsHero';
import EventsList from '../components/EventsList';
import Footer from '../components/Footer';

const Events = () => {
  return (
    <div className="w-full bg-[#fafafa]">
      <EventsHero />
      <EventsList />
      <Footer />
    </div>
  );
};

export default Events;