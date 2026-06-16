import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import { offerings } from '../data/offerings';
import './Home.css';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Search logic
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    const matchedColleges = colleges
      .filter(c => c.name.toLowerCase().includes(query))
      .map(c => ({ ...c, searchType: 'college' }));
      
    const matchedPrograms = programs
      .filter(p => p.name.toLowerCase().includes(query))
      .map(p => ({ ...p, searchType: 'program' }));
      
    return [...matchedColleges, ...matchedPrograms].slice(0, 8); // top 8 suggestions
  }, [searchQuery]);

  const handleSuggestionClick = (item) => {
    if (item.searchType === 'college') {
      navigate(`/college/${item.id}`);
    } else {
      navigate(`/cutoffs?program=${item.id}`);
    }
  };

  // Stats calculation
  const totalColleges = colleges.length;
  const totalCourses = programs.length;
  const totalSeats = offerings.reduce((sum, off) => sum + off.totalSeats, 0);
  const dataYear = offerings.length > 0 ? offerings[0].year : 'N/A';

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>DU Admissions Explorer</h1>
        <p>A structured guide to Delhi University colleges, courses, and cutoffs.</p>
        
        <div className="search-container">
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            className="search-input"
            placeholder="Search colleges or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((item) => (
                <div 
                  key={`${item.searchType}-${item.id}`} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <span className="suggestion-title">{item.name}</span>
                  <span className="suggestion-type">
                    {item.searchType === 'college' ? 'College' : 'Course'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-searches">
          <span className="quick-search-label">Popular:</span>
          <button className="quick-search-pill" onClick={() => setSearchQuery('SRCC')}>SRCC</button>
          <button className="quick-search-pill" onClick={() => setSearchQuery('St. Stephen\'s')}>St. Stephen's</button>
          <button className="quick-search-pill" onClick={() => setSearchQuery('B.A. Program')}>B.A. Program</button>
          <button className="quick-search-pill" onClick={() => setSearchQuery('Psychology')}>Psychology</button>
          <button className="quick-search-pill" onClick={() => setSearchQuery('North Campus')}>North Campus</button>
        </div>
      </section>

      {/* Main Navigation Grid */}
      <section className="nav-tile-grid">
        <Link to="/colleges" className="nav-tile">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 22 7 12 2"></polygon><polyline points="2 17 2 22 22 22 22 17"></polyline><line x1="6" y1="12" x2="6" y2="17"></line><line x1="10" y1="12" x2="10" y2="17"></line><line x1="14" y1="12" x2="14" y2="17"></line><line x1="18" y1="12" x2="18" y2="17"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Explore Colleges</h3>
            <p>Browse all DU colleges, facilities, and offered courses</p>
          </div>
        </Link>
        
        <a href="https://course-cuetpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="nav-tile">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Seats & Cutoffs</h3>
            <p>Check official seat matrix and previous year cutoffs</p>
          </div>
        </a>

        <Link to="/eligibility" className="nav-tile">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Eligibility Checker</h3>
            <p>Find which courses match your CUET subjects</p>
          </div>
        </Link>

        <a href="https://cuetpro.com/preference-sheet/" target="_blank" rel="noopener noreferrer" className="nav-tile">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Preference Sheet Maker</h3>
            <p>Create and order your CSAS preference list</p>
          </div>
        </a>

        <Link to="/map" className="nav-tile">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Campus Map</h3>
            <p>Interactive map of North, South & Off-campus colleges</p>
          </div>
        </Link>
      </section>

    </div>
  );
}
