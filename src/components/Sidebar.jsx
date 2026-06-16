import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        ☰
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={closeMenu}>
            DU Admissions Explorer
          </Link>
          <button className="mobile-menu-close" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <div className="sidebar-links">
          <Link to="/" className={`sidebar-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
          <Link to="/colleges" className={`sidebar-link ${isActive('/colleges')}`} onClick={closeMenu}>Colleges</Link>
          <Link to="/eligibility" className={`sidebar-link ${isActive('/eligibility')}`} onClick={closeMenu}>Eligibility</Link>
          <Link to="/cutoffs" className={`sidebar-link ${isActive('/cutoffs')}`} onClick={closeMenu}>Cutoffs</Link>
          <Link to="/predictor" className={`sidebar-link ${isActive('/predictor')}`} onClick={closeMenu}>Predictor</Link>
          <Link to="/preference-sheet" className={`sidebar-link ${isActive('/preference-sheet')}`} onClick={closeMenu}>Preference Sheet</Link>
          <Link to="/map" className={`sidebar-link ${isActive('/map')}`} onClick={closeMenu}>Map</Link>
        </div>
      </nav>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}
    </>
  );
}
