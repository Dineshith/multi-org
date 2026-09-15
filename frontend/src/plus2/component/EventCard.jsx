import React from 'react';

export default function EventCard({ day, month, title, subtitle }) {
  return (
    <div className="event-card-simple">
      <div className="event-date-box">
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div className="event-text">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}