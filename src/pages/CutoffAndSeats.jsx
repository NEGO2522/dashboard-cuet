import React, { useState } from 'react';
import './CutoffAndSeats.css';

export function CutoffAndSeats() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="predictor-container">
      <div className="pred-header">
        <h1>Seats & Cutoffs</h1>
      </div>

      <div className="pred-disclaimer">
        <strong>Indicative only, based on last year's data.</strong> This is NOT a guarantee — actual allocation depends on this year's applicant pool and CSAS rounds.
      </div>

      {!iframeError ? (
        <div className="iframe-wrapper">
          <iframe
            src="https://course-cuetpro.vercel.app/"
            title="DU College Predictor"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="embedded-tool"
            onError={() => setIframeError(true)}
          />
        </div>
      ) : (
        <div className="fallback-card">
          <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
            The tool cannot be embedded directly in this browser.
          </p>
          <a href="https://course-cuetpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="fallback-button">
            Open Seats & Cutoffs ↗
          </a>
        </div>
      )}

      {!iframeError && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            If the tool above isn't loading, you can open it in a new tab:
          </p>
          <a href="https://course-cuetpro.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent-color)', fontWeight: 500, textDecoration: 'none' }}>
            Open safely ↗
          </a>
        </div>
      )}
    </div>
  );
}
