import React, { useState } from 'react';
import './PreferenceSheet.css';

export function PreferenceSheet() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="pref-container">
      <div className="pref-header">
        <h1>Preference Sheet Maker</h1>
      </div>

      <div className="pref-note" style={{ marginBottom: '1rem' }}>
        <strong>Note:</strong> Actual preferences are submitted on the official CSAS portal. This list is a planning aid to help you decide your order first.
      </div>

      {!iframeError ? (
        <div className="iframe-wrapper">
          <iframe 
            src="https://cuetpro.com/preference-sheet/" 
            title="DU Preference Sheet Maker"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="embedded-tool"
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
      
      {/* Fallback button just in case the iframe is silently blocked by the browser */}
      {!iframeError && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            If the tool above isn't loading, you can open it in a new tab:
          </p>
          <a href="https://cuetpro.com/preference-sheet/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent-color)', fontWeight: 500, textDecoration: 'none' }}>
            Open Preference Sheet Maker safely ↗
          </a>
        </div>
      )}
    </div>
  );
}
