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
    <div className="home-container container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>DU Admissions Explorer</h1>
        <p>A structured guide to Delhi University colleges, courses, and cutoffs.</p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search for a college or course (e.g. B.Com, Hindu)"
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
      </section>

      {/* Quick Access Grid */}
      <section className="quick-access-grid">
        <Link to="/colleges" className="grid-tile">Explore colleges</Link>
        <Link to="/eligibility" className="grid-tile">Browse courses</Link>
        <Link to="/cutoffs" className="grid-tile">Cutoffs & seats</Link>
        <Link to="/predictor" className="grid-tile">College predictor</Link>
        <Link to="/preference-sheet" className="grid-tile">Preference sheet maker</Link>
        <Link to="/map" className="grid-tile">Map & community</Link>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="stat-item">
          <span className="stat-value">{formatNumber(totalColleges)}</span>
          <span className="stat-label">Colleges</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatNumber(totalCourses)}</span>
          <span className="stat-label">Courses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatNumber(totalSeats)}</span>
          <span className="stat-label">Total Seats</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{dataYear}</span>
          <span className="stat-label">Data Year</span>
        </div>
      </section>
    </div>
  );
}
