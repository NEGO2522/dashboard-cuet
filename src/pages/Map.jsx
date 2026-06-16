import React from 'react';
import './Map.css';

export function Map() {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="pulse-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h1>Interactive Campus Map</h1>
        <h2>Coming Soon</h2>
        <div className="brand-badge">By CuetPro</div>
      </div>
    </div>
  );
}
