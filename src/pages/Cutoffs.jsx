import React, { useState, useMemo } from 'react';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import { offerings } from '../data/offerings';
import { SourceBadge } from '../components/SourceBadge';
import './Cutoffs.css';

export function Cutoffs() {
  const [viewMode, setViewMode] = useState('program'); // 'program' or 'college'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [category, setCategory] = useState('General');
  const [round, setRound] = useState('round1');
  
  // Extract available years from mock data
  const availableYears = useMemo(() => {
    const years = new Set(offerings.map(o => o.year));
    return Array.from(years).sort((a, b) => b - a);
  }, []);
  const [year, setYear] = useState(availableYears[0]?.toString() || '2023');
  
  const [sortBy, setSortBy] = useState('A-Z');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Helper to extract cutoff value correctly
  const getCutoffValue = (cutoffs) => {
    if (!cutoffs || !cutoffs[category]) return null;
    return cutoffs[category][round];
  };

  // Helper to safely get seats
  const getSeatsValue = (seatsObj) => {
    if (!seatsObj || seatsObj[category] === undefined) return 0;
    return seatsObj[category];
  };

  // Generate data rows based on viewMode
  const tableData = useMemo(() => {
    let rows = [];

    // Filter offerings by year
    const yearOfferings = offerings.filter(o => o.year.toString() === year.toString());

    if (viewMode === 'program') {
      rows = programs.map(prog => {
        const progOfferings = yearOfferings.filter(o => o.programId === prog.id);
        let totalSeats = 0;
        let cutoffs = [];
        
        const subRows = progOfferings.map(o => {
          const coll = colleges.find(c => c.id === o.collegeId);
          const seats = getSeatsValue(o.seatsByCategory);
          const cutoff = getCutoffValue(o.cutoffsByCategoryAndRound);
          
          totalSeats += seats;
          if (cutoff !== null) cutoffs.push(cutoff);
          
          return {
            id: coll ? coll.id : o.collegeId,
            name: coll ? coll.name : o.collegeId,
            seats,
            cutoff
          };
        });

        return {
          id: prog.id,
          name: prog.name,
          count: progOfferings.length,
          totalSeats,
          minCutoff: cutoffs.length > 0 ? Math.min(...cutoffs) : null,
          maxCutoff: cutoffs.length > 0 ? Math.max(...cutoffs) : null,
          subRows
        };
      });
    } else {
      rows = colleges.map(coll => {
        const collOfferings = yearOfferings.filter(o => o.collegeId === coll.id);
        let totalSeats = 0;
        let cutoffs = [];
        
        const subRows = collOfferings.map(o => {
          const prog = programs.find(p => p.id === o.programId);
          const seats = getSeatsValue(o.seatsByCategory);
          const cutoff = getCutoffValue(o.cutoffsByCategoryAndRound);
          
          totalSeats += seats;
          if (cutoff !== null) cutoffs.push(cutoff);
          
          return {
            id: prog ? prog.id : o.programId,
            name: prog ? prog.name : o.programId,
            seats,
            cutoff
          };
        });

        return {
          id: coll.id,
          name: coll.name,
          count: collOfferings.length,
          totalSeats,
          minCutoff: cutoffs.length > 0 ? Math.min(...cutoffs) : null,
          maxCutoff: cutoffs.length > 0 ? Math.max(...cutoffs) : null,
          subRows
        };
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => r.name.toLowerCase().includes(q));
    }

    // Sort
    rows.sort((a, b) => {
      if (sortBy === 'A-Z') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'Seats') {
        return b.totalSeats - a.totalSeats;
      } else if (sortBy === 'Cutoff') {
        const valA = a.maxCutoff || 0;
        const valB = b.maxCutoff || 0;
        return valB - valA;
      }
      return 0;
    });

    return rows;
  }, [viewMode, searchQuery, category, round, year, sortBy]);

  const renderCutoffRange = (min, max) => {
    if (min === null && max === null) return 'N/A';
    if (min === max) return min;
    return `${min} – ${max}`;
  };

  return (
    <div className="cutoffs-container">
      <div className="cutoffs-header">
        <h1 className="cutoffs-title">Cutoffs & Seats</h1>
        <p className="cutoffs-critical-rule">
          Official seat matrix and previous year cutoff scores — CSAS 2023 data
        </p>
      </div>

      <div className="quick-stats-bar" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.5rem', boxShadow: 'var(--shadow-sm)', flex: 1 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{programs.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Programs</div>
        </div>
        <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.5rem', boxShadow: 'var(--shadow-sm)', flex: 1 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{colleges.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Colleges</div>
        </div>
        <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.5rem', boxShadow: 'var(--shadow-sm)', flex: 1 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>2023</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Data Year</div>
        </div>
      </div>

      <div className="cutoffs-top-controls">
        <div className="view-toggle">
          <button 
            className={viewMode === 'program' ? 'active' : ''} 
            onClick={() => { setViewMode('program'); setExpandedRows(new Set()); }}
          >
            By program
          </button>
          <button 
            className={viewMode === 'college' ? 'active' : ''} 
            onClick={() => { setViewMode('college'); setExpandedRows(new Set()); }}
          >
            By college
          </button>
        </div>
        <input 
          type="text" 
          className="search-box"
          placeholder={`Search ${viewMode === 'program' ? 'programs' : 'colleges'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="OBC-NCL">OBC-NCL</option>
            <option value="EWS">EWS</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="PwBD">PwBD</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Round</label>
          <select className="filter-select" value={round} onChange={e => setRound(e.target.value)}>
            <option value="round1">Round 1</option>
            <option value="round2">Round 2</option>
            <option value="round3">Final</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="A-Z">A–Z</option>
            <option value="Seats">Seats</option>
            <option value="Cutoff">Cutoff</option>
          </select>
        </div>
      </div>

      <div className="table-badge-row">
        <h3>{viewMode === 'program' ? 'Programs' : 'Colleges'}</h3>
        <SourceBadge date="Aug 2023" />
      </div>

      <div className="cutoffs-table-container">
        <table className="cutoffs-table">
          <thead>
            <tr>
              <th>{viewMode === 'program' ? 'Program Name' : 'College Name'}</th>
              <th>{viewMode === 'program' ? 'Colleges Offering' : 'Courses Offered'}</th>
              <th>Total Seats</th>
              <th>Cutoff Range</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No results found.</td>
              </tr>
            )}
            {tableData.map(row => {
              const isExpanded = expandedRows.has(row.id);
              
              return (
                <React.Fragment key={row.id}>
                  <tr onClick={() => toggleRow(row.id)}>
                    <td style={{ fontWeight: 500 }}>
                      {isExpanded ? '▾' : '▸'} {row.name}
                    </td>
                    <td>{row.count}</td>
                    <td>{row.totalSeats}</td>
                    <td>{renderCutoffRange(row.minCutoff, row.maxCutoff)}</td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="expanded-row-content">
                      <td colSpan="4" style={{ padding: '1rem 2rem' }}>
                        {row.subRows.length > 0 ? (
                          <table className="sub-table">
                            <thead>
                              <tr>
                                <th>{viewMode === 'program' ? 'College' : 'Course'}</th>
                                <th>Seats</th>
                                <th>Cutoff</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.subRows.map((sub, idx) => (
                                <tr key={sub.id + idx}>
                                  <td>{sub.name}</td>
                                  <td>{sub.seats}</td>
                                  <td>{sub.cutoff !== null ? sub.cutoff : 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                            No offerings match this filter.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bottom-note">
        Cutoff = the lowest CUET merit score (out of 1000) at which a seat was allotted in the selected round and category.
      </div>
    </div>
  );
}
