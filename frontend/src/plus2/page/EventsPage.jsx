import React from 'react';
import Header from '../component/Header.jsx';
import Footer from '../component/Footer.jsx';
import EventCard from '../component/EventCard.jsx';
import '../assets/style.css'; 

export default function EventsPage() {
  const eventList = Array(12).fill({
    day: '29',
    month: 'May',
    title: 'Blood Donation Program 2082',
    subtitle: 'Blood donation program 2082'
  });

  return (
    <div className="page-wrapper">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="red-line"></div>
              <h1>Events</h1>
            </div>
          </div>
        </section>

        <section className="event-list-section">
          <div className="event-grid">
            {eventList.map((evt, index) => (
              <EventCard 
                key={index}
                day={evt.day} 
                month={evt.month} 
                title={evt.title} 
                subtitle={evt.subtitle} 
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}