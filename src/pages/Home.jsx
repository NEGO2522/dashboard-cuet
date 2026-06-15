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
        <a href="https://course-cuetpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="grid-tile">Seats & Cutoffs</a>
        <a href="https://cuetpro.com/preference-sheet/" target="_blank" rel="noopener noreferrer" className="grid-tile">Preference sheet maker</a>
      </section>

    </div>
  );
}
