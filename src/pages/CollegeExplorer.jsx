import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import './CollegeExplorer.css';

export function CollegeExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [hostelOnly, setHostelOnly] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      if (searchQuery.trim() && !college.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (campusFilter !== 'All' && college.campus !== campusFilter) {
        return false;
      }
      if (typeFilter !== 'All' && college.type !== typeFilter) {
        return false;
      }
      if (hostelOnly && (!college.facilities || !college.facilities.includes('Hostel'))) {
        return false;
      }
      return true;
    });
  }, [searchQuery, campusFilter, typeFilter, hostelOnly]);

  useEffect(() => {
    setVisibleCount(15);
  }, [searchQuery, campusFilter, typeFilter, hostelOnly]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300) {
        setVisibleCount(prev => (prev >= filteredColleges.length ? prev : prev + 15));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredColleges.length]);

  const clearFilters = () => {
    setSearchQuery('');
    setCampusFilter('All');
    setTypeFilter('All');
    setHostelOnly(false);
  };

  return (
    <div className="ce-container">
      <div className="ce-hero">
        <h1 className="ce-title">Explore DU Colleges</h1>
        <p className="ce-subtitle">Discover all 91 affiliated colleges, check facilities, and explore their campuses.</p>
      </div>

      <div className="ce-controls-container">
        <div className="ce-search-wrapper">
          <svg className="ce-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="ce-search-input" 
            placeholder="Search colleges by name (e.g. Hindu, Miranda)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ce-filters-section">
          <div className="ce-filters-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filter Colleges</span>
          </div>
          
          <div className="ce-filters-row">
            <div className="ce-filter-group">
              <span className="ce-filter-label">Campus</span>
              <div className="ce-filter-chips">
                {['All', 'North', 'South', 'East', 'West', 'Central', 'Various'].map(c => (
                  <button key={c} className={`ce-chip ${campusFilter === c ? 'active' : ''}`} onClick={() => setCampusFilter(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="ce-filter-group">
              <span className="ce-filter-label">Type</span>
              <div className="ce-filter-chips">
                {['All', 'Co-ed', 'Women'].map(t => (
                  <button key={t} className={`ce-chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="ce-filter-group">
              <span className="ce-filter-label">Facilities</span>
              <div className="ce-filter-chips">
                <button className={`ce-chip ${hostelOnly ? 'active' : ''}`} onClick={() => setHostelOnly(!hostelOnly)}>
                  Hostel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ce-results-header">
        <span className="ce-results-count">
          Showing {Math.min(visibleCount, filteredColleges.length)} of {filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'}
        </span>
      </div>

      {filteredColleges.length > 0 ? (
        <>
          <div className="ce-grid">
            {filteredColleges.slice(0, visibleCount).map(college => (
              <div key={college.id} className="ce-card">
                <div 
                  className="ce-card-image" 
                  style={{ backgroundImage: `url(${college.imageUrl ? college.imageUrl : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'})` }}
                >
                  <div className="ce-card-image-overlay"></div>
                  <div className="ce-card-badges-top">
                    <span className="ce-badge ce-badge-campus">{college.campus} Campus</span>
                  </div>
                </div>
                
                <div className="ce-card-content">
                  <div className="ce-card-header">
                    <h2 className="ce-card-title">{college.name}</h2>
                    <div className="ce-card-badges">
                      <span className="ce-badge ce-badge-type">{college.type}</span>
                    </div>
                  </div>
                  
                  <p className="ce-card-intro">
                    {college.intro ? (college.intro.length > 130 ? college.intro.substring(0, 130) + '...' : college.intro) : 'No description available.'}
                  </p>

                  <div className="ce-card-facilities">
                    {college.facilities && college.facilities.length > 0 ? (
                      college.facilities.slice(0, 3).map(f => (
                        <span key={f} className="ce-facility-tag">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="ce-facility-none">Facilities data unavailable</span>
                    )}
                  </div>

                  <div className="ce-card-actions">
                    <Link to={`/college/${college.id}`} className="ce-btn ce-btn-primary">
                      View Details
                    </Link>
                    {college.officialWebsite && (
                      <a href={college.officialWebsite} target="_blank" rel="noopener noreferrer" className="ce-btn ce-btn-secondary">
                        Visit Website
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {visibleCount < filteredColleges.length && (
            <div className="ce-loading-spinner">
              <div className="spinner"></div>
              <span>Loading more colleges...</span>
            </div>
          )}
        </>
      ) : (
        <div className="ce-empty-state">
          <div className="ce-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <p className="ce-empty-text">No colleges found matching your criteria.</p>
          <button className="ce-clear-btn" onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}
