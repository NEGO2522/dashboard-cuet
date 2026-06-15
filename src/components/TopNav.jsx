import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="top-nav">
      <Link to="/" className="brand" onClick={closeMenu}>
        DU Admissions Explorer
      </Link>
      
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        ☰
      </button>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/colleges" className="nav-link" onClick={closeMenu}>Colleges</Link>
        <Link to="/eligibility" className="nav-link" onClick={closeMenu}>Eligibility</Link>
        <Link to="/cutoffs" className="nav-link" onClick={closeMenu}>Cutoffs</Link>
        <Link to="/predictor" className="nav-link" onClick={closeMenu}>Predictor</Link>
        <Link to="/preference-sheet" className="nav-link" onClick={closeMenu}>Preference Sheet</Link>
        <Link to="/map" className="nav-link" onClick={closeMenu}>Map</Link>
      </div>
    </nav>
  );
}
