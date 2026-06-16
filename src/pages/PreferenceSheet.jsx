import React, { useState } from 'react';
import './PreferenceSheet.css';

export function PreferenceSheet() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="pref-container-fullscreen">
      {!iframeError ? (
        <div className="iframe-wrapper-fullscreen">
          <iframe 
            src="https://cuetpro.com/preference-sheet/" 
            title="DU Preference Sheet Maker"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="embedded-tool-fullscreen"
            onError={() => setIframeError(true)}
          />
        </div>
      ) : (
        <div className="fallback-card">
          <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
            The Preference Sheet Maker cannot be embedded directly in this browser.
          </p>
          <a href="https://cuetpro.com/preference-sheet/" target="_blank" rel="noopener noreferrer" className="fallback-button">
            Open Preference Sheet Maker ↗
          </a>
        </div>
      )}
    </div>
  );
}
