import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import './CollegeExplorer.css';

export function CollegeExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [hostelOnly, setHostelOnly] = useState(false);

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      // Name filter
      if (searchQuery.trim() && !college.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Campus filter
      if (campusFilter !== 'All' && college.campus !== campusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'All' && college.type !== typeFilter) {
        return false;
      }
      // Hostel filter
      if (hostelOnly && (!college.facilities || !college.facilities.includes('Hostel'))) {
        return false;
      }
      return true;
    });
  }, [searchQuery, campusFilter, typeFilter, hostelOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setCampusFilter('All');
    setTypeFilter('All');
    setHostelOnly(false);
  };

  return (
    <div className="ce-container">
      <h1 className="ce-title">Explore Colleges</h1>
      <p className="ce-subtitle">Browse and filter all colleges affiliated with Delhi University.</p>

      <div className="ce-controls-container">
        <input 
          type="text" 
          className="ce-search-input" 
          placeholder="Search colleges by name (e.g. Hindu, Miranda)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="ce-filters-row">
          <div className="ce-filter-group">
            <span className="ce-filter-label">Campus</span>
            <div className="ce-filter-chips">
              {['All', 'North', 'South', 'Off-campus'].map(c => (
                <button 
                  key={c} 
                  className={`ce-chip ${campusFilter === c ? 'active' : ''}`}
                  onClick={() => setCampusFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="ce-filter-group">
            <span className="ce-filter-label">Type</span>
            <div className="ce-filter-chips">
              {['All', 'Co-ed', 'Women'].map(t => (
                <button 
                  key={t} 
                  className={`ce-chip ${typeFilter === t ? 'active' : ''}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="ce-filter-group">
            <span className="ce-filter-label">Facilities</span>
            <div className="ce-filter-chips">
              <button 
                className={`ce-chip ${hostelOnly ? 'active' : ''}`}
                onClick={() => setHostelOnly(!hostelOnly)}
              >
                Hostel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ce-results-header">
        <span className="ce-results-count">
          {filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'}
        </span>
      </div>

      {filteredColleges.length > 0 ? (
        <div className="ce-grid">
          {filteredColleges.map(college => (
            <Link 
              key={college.id} 
              to={`/college/${college.id}`}
              className="ce-card"
            >
              <h2 className="ce-card-title">{college.name}</h2>
              <div className="ce-card-subtitle">
                {college.campus} Campus · {college.type}
              </div>
              <div className="ce-card-facilities">
                {college.facilities && college.facilities.slice(0, 3).map(f => (
                  <span key={f} className="ce-facility-tag">
                    {f}
                  </span>
                ))}
                {college.facilities && college.facilities.length > 3 && (
                  <span className="ce-facility-tag">
                    +{college.facilities.length - 3}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="ce-empty-state">
          <p className="ce-empty-text">No colleges match these filters.</p>
          <button className="ce-clear-btn" onClick={clearFilters}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
