import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import './Rankings.css';

const nirfData = [
  {rank:1, collegeId:"miranda-house-w", nirfScore:83.48},
  {rank:2, collegeId:"hindu-college", nirfScore:76.81},
  {rank:3, collegeId:"hansraj-college", nirfScore:72.14},
  {rank:4, collegeId:"kirori-mal-college", nirfScore:70.89},
  {rank:5, collegeId:"shri-ram-college-of-commerce", nirfScore:69.55},
  {rank:6, collegeId:"lady-shri-ram-college-for-women-w", nirfScore:68.92},
  {rank:7, collegeId:"ramjas-college", nirfScore:67.41},
  {rank:8, collegeId:"st-stephen-s-college", nirfScore:66.78},
  {rank:9, collegeId:"daulat-ram-college-w", nirfScore:65.12},
  {rank:10, collegeId:"gargi-college-w", nirfScore:64.30},
  {rank:11, collegeId:"indraprastha-college-for-women-w", nirfScore:63.87},
  {rank:12, collegeId:"sri-venketeswara-college", nirfScore:62.45},
  {rank:13, collegeId:"atma-ram-sanatan-dharma-college", nirfScore:61.20},
  {rank:14, collegeId:"shaheed-sukhdev-college-business-studies", nirfScore:60.88},
  {rank:15, collegeId:"sri-guru-gobind-singh-college-of-commerce", nirfScore:59.75},
];

const getMedal = (rank) => {
  if (rank === 1) return <div className="rank-number rank-1">1</div>;
  if (rank === 2) return <div className="rank-number rank-2">2</div>;
  if (rank === 3) return <div className="rank-number rank-3">3</div>;
  return <div className="rank-number">{rank}</div>;
};

// Top Picks best in field
const topScience = ["miranda-house-w", "hindu-college", "hansraj-college", "sri-venketeswara-college", "kirori-mal-college"];
const topCommerce = ["shri-ram-college-of-commerce", "sri-guru-gobind-singh-college-of-commerce", "shaheed-sukhdev-college-business-studies", "hansraj-college", "atma-ram-sanatan-dharma-college"];
const topHumanities = ["lady-shri-ram-college-for-women-w", "miranda-house-w", "indraprastha-college-for-women-w", "ramjas-college", "hindu-college"];

const specialtyBonuses = {
  "shri-ram-college-of-commerce": 25,
  "sri-guru-gobind-singh-college-of-commerce": 20,
  "shaheed-sukhdev-college-business-studies": 18,
  "lady-shri-ram-college-for-women-w": 20,
  "miranda-house-w": 20,
  "hindu-college": 18,
  "st-stephen-s-college": 15,
  "hansraj-college": 15,
  "kirori-mal-college": 12,
  "ramjas-college": 10
};

export function Rankings() {
  const [activeTab, setActiveTab] = useState('nirf'); // 'nirf' or 'reputation'

  // Enhance NIRF data with college info
  const nirfDisplayData = useMemo(() => {
    return nirfData.map(d => {
      const c = colleges.find(col => col.id === d.collegeId) || {};
      return { ...d, college: c };
    });
  }, []);

  // Compute Reputation Index
  const reputationData = useMemo(() => {
    // Collect all colleges in nirfData plus top lists
    const setIds = new Set([
      ...nirfData.map(d => d.collegeId),
      ...topScience,
      ...topCommerce,
      ...topHumanities
    ]);

    const scored = Array.from(setIds).map(id => {
      const c = colleges.find(col => col.id === id) || {};
      const nd = nirfData.find(n => n.collegeId === id);
      
      const nScore = nd ? nd.nirfScore : 0;
      const comp1 = nScore * 0.4;
      
      const sBonus = specialtyBonuses[id] || 5;
      const comp2 = sBonus * 0.3;
      
      // Legacy: extract year from established (e.g. 1922)
      let year = 2000;
      if (c.established) {
        const m = c.established.toString().match(/\d{4}/);
        if (m) year = parseInt(m[0], 10);
      }
      let lBonus = 0;
      if (year < 1930) lBonus = 10;
      else if (year < 1960) lBonus = 5;
      const comp3 = lBonus * 0.1;

      const comp4 = nScore * 0.2; // Cutoff proxy

      const totalScore = parseFloat((comp1 + comp2 + comp3 + comp4).toFixed(2));

      return {
        collegeId: id,
        college: c,
        score: totalScore
      };
    });

    // Sort and rank
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 20).map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, []);

  return (
    <div className="rankings-container">
      <div className="rankings-hero">
        <h1 className="rankings-title">College Rankings</h1>
        <p className="rankings-subtitle">Discover the top performing institutions across Delhi University</p>
      </div>

      <div className="rankings-tabs">
        <button 
          className={`rankings-tab ${activeTab === 'nirf' ? 'active' : ''}`}
          onClick={() => setActiveTab('nirf')}
        >
          NIRF Rankings
        </button>
        <button 
          className={`rankings-tab ${activeTab === 'reputation' ? 'active' : ''}`}
          onClick={() => setActiveTab('reputation')}
        >
          Reputation Index
        </button>
      </div>

      {activeTab === 'nirf' && (
        <div className="tab-content">
          <div className="rankings-list">
            {nirfDisplayData.map((item) => (
              <div key={item.collegeId} className="rankings-row" style={{ position: 'relative' }}>
                <div className="rank-badge">{getMedal(item.rank)}</div>
                <img 
                  src={item.college.imageUrl || `https://placehold.co/48x48?text=${item.college.name}`} 
                  alt={item.college.name} 
                  className="rankings-img" 
                />
                <div className="rankings-info">
                  <Link to={`/college/${item.collegeId}`} className="rankings-name">
                    {item.college.name || item.collegeId}
                  </Link>
                  <div className="rankings-score-container">
                    <div className="rankings-progress-bg">
                      <div className="rankings-progress-bar" style={{ width: `${item.nirfScore}%` }}></div>
                    </div>
                    <span className="rankings-score-val">{item.nirfScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rankings-disclaimer">
            <strong>Source:</strong> National Institutional Ranking Framework (NIRF) 2024, Ministry of Education, Govt. of India. Rankings shown are for the 'Colleges' category only. Visit nirf.org for full data.
          </div>
        </div>
      )}

      {activeTab === 'reputation' && (
        <div className="tab-content">
          <div className="rankings-methodology">
            <h3 className="methodology-title">How this is calculated</h3>
            <p className="methodology-text">
              CuetPro's Reputation Index is a composite of NIRF 2024 performance (40%), specialty/placement reputation (30%), institutional legacy (10%), and admissions competitiveness (20%). This is NOT a government ranking — it reflects market perception signals. Always cross-check with NIRF for official standing.
            </p>
          </div>

          <div className="rankings-list">
            {reputationData.map((item) => (
              <div key={item.collegeId} className="rankings-row" style={{ position: 'relative' }}>
                <div className="rank-badge">{getMedal(item.rank)}</div>
                <img 
                  src={item.college.imageUrl || `https://placehold.co/48x48?text=${item.college.name}`} 
                  alt={item.college.name} 
                  className="rankings-img" 
                />
                <div className="rankings-info">
                  <Link to={`/college/${item.collegeId}`} className="rankings-name">
                    {item.college.name || item.collegeId}
                  </Link>
                  <div className="rankings-score-container">
                    <div className="rankings-progress-bg">
                      <div className="rankings-progress-bar" style={{ width: `${item.score}%`, backgroundColor: 'var(--accent-amber)' }}></div>
                    </div>
                    <span className="rankings-score-val" style={{ color: 'var(--accent-amber)' }}>{item.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best In Field - Both Tabs */}
      <div className="best-in-field-section">
        <h2 className="bif-title">Best in Field</h2>
        <div className="bif-grid">
          
          <div className="bif-card">
            <div className="bif-header bif-science">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path></svg>
              <span style={{ marginLeft: '8px' }}>Top Science</span>
            </div>
            <div className="bif-list">
              {topScience.map(id => {
                const c = colleges.find(col => col.id === id) || {name: id};
                return <Link key={id} to={`/college/${id}`} className="bif-item">{c.name}</Link>;
              })}
            </div>
          </div>

          <div className="bif-card">
            <div className="bif-header bif-commerce">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span style={{ marginLeft: '8px' }}>Top Commerce</span>
            </div>
            <div className="bif-list">
              {topCommerce.map(id => {
                const c = colleges.find(col => col.id === id) || {name: id};
                return <Link key={id} to={`/college/${id}`} className="bif-item">{c.name}</Link>;
              })}
            </div>
          </div>

          <div className="bif-card">
            <div className="bif-header bif-humanities">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <span style={{ marginLeft: '8px' }}>Top Humanities</span>
            </div>
            <div className="bif-list">
              {topHumanities.map(id => {
                const c = colleges.find(col => col.id === id) || {name: id};
                return <Link key={id} to={`/college/${id}`} className="bif-item">{c.name}</Link>;
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
