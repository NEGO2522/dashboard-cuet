import React from 'react';
import './Documents.css';

export function Documents() {
  return (
    <div className="documents-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Coming Soon</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Stay Tuned By CuetPro.com</p>
    </div>
  );
}
