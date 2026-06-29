import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="global-footer">
      <div className="global-footer-container">
        <p className="global-footer-text">
          While we do our best to provide accurate and up-to-date data, please cross-reference and verify key details on the official <a href="https://admission.uod.ac.in/" target="_blank" rel="noopener noreferrer" className="global-footer-link">Delhi University Admission Portal</a> as well.
        </p>
        <p className="global-footer-copyright">
          © {new Date().getFullYear()} CuetPro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
