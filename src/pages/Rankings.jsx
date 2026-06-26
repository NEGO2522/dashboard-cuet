import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import './Rankings.css';

const nirfData = [
  {rank:1,  college:"Hindu College",                                        indiaRank:1,  score:84.01, tlr:86.00,   rpc:66.92, go:88.90, oi:77.35, perception:96.08},
  {rank:2,  college:"Miranda House",                                        indiaRank:2,  score:83.20, tlr:83.48,   rpc:69.09, go:88.98, oi:84.79, perception:87.30},
  {rank:3,  college:"Hans Raj College",                                     indiaRank:3,  score:81.75, tlr:85.00,   rpc:96.31, go:70.65, oi:77.81, perception:78.61},
  {rank:4,  college:"Kirori Mal College",                                   indiaRank:4,  score:80.33, tlr:86.67,   rpc:79.65, go:83.61, oi:73.78, perception:54.29},
  {rank:5,  college:"St. Stephen's College",                                indiaRank:5,  score:79.41, tlr:82.27,   rpc:45.96, go:91.23, oi:74.90, perception:93.15},
  {rank:6,  college:"Atma Ram Sanatan Dharm College (ARSD)",               indiaRank:7,  score:76.09, tlr:74.28,   rpc:96.36, go:80.14, oi:70.97, perception:47.98},
  {rank:7,  college:"Sri Venkateswara College",                            indiaRank:11, score:72.61, tlr:79.37,   rpc:82.17, go:75.02, oi:73.26, perception:24.47},
  {rank:8,  college:"Deshbandhu College",                                  indiaRank:13, score:71.26, tlr:69.75,   rpc:84.69, go:85.36, oi:66.06, perception:27.11},
  {rank:9,  college:"Lady Shri Ram College for Women (LSR)",               indiaRank:17, score:69.87, tlr:61.03,   rpc:29.41, go:94.69, oi:73.78, perception:100},
  {rank:10, college:"Shri Ram College of Commerce (SRCC)",                 indiaRank:18, score:69.01, tlr:68.73,   rpc:16.36, go:95.91, oi:78.21, perception:72.72},
  {rank:11, college:"Acharya Narendra Dev College",                        indiaRank:21, score:68.21, tlr:71.93,   rpc:85.98, go:68.85, oi:64.74, perception:28.61},
  {rank:12, college:"Daulat Ram College",                                  indiaRank:26, score:64.56, tlr:72.74,   rpc:34.18, go:73.72, oi:74.60, perception:44.42},
  {rank:13, college:"Deen Dayal Upadhyaya College (DDU)",                 indiaRank:27, score:64.19, tlr:62.07,   rpc:80.30, go:65.64, oi:71.16, perception:37.86},
  {rank:14, college:"Ramjas College",                                      indiaRank:28, score:63.82, tlr:68.22,   rpc:75.74, go:62.54, oi:71.53, perception:23.92},
  {rank:15, college:"Sri Guru Tegh Bahadur Khalsa College (SGTB)",        indiaRank:29, score:63.26, tlr:80.39,   rpc:48.55, go:65.90, oi:63.81, perception:9.58},
  {rank:16, college:"Delhi College of Arts & Commerce (DCAC)",            indiaRank:30, score:63.11, tlr:75.49,   rpc:10.87, go:83.80, oi:65.10, perception:38.25},
  {rank:17, college:"Lady Irwin College",                                  indiaRank:31, score:62.88, tlr:70.95,   rpc:41.30, go:69.48, oi:63.52, perception:45.75},
  {rank:18, college:"Sri Guru Gobind Singh College of Commerce",           indiaRank:32, score:62.63, tlr:74.57,   rpc:10.19, go:94.25, oi:68.31, perception:8.79},
  {rank:19, college:"Gargi College",                                       indiaRank:33, score:62.48, tlr:66.67,   rpc:46.55, go:68.89, oi:71.68, perception:44.42},
  {rank:20, college:"Dyal Singh College",                                  indiaRank:36, score:61.99, tlr:68.05,   rpc:56.31, go:73.21, oi:62.81, perception:17.36},
  {rank:21, college:"Ramanujan College",                                   indiaRank:37, score:61.85, tlr:67.96,   rpc:37.04, go:81.74, oi:71.93, perception:14.70},
  {rank:22, college:"Maitreyi College",                                    indiaRank:38, score:61.84, tlr:64.44,   rpc:49.53, go:81.85, oi:69.90, perception:11.85},
  {rank:23, college:"Shaheed Bhagat Singh College",                        indiaRank:39, score:61.55, tlr:69.02,   rpc:50.43, go:75.96, oi:66.69, perception:7.18},
  {rank:24, college:"Shyam Lal College",                                   indiaRank:43, score:60.96, tlr:71.29,   rpc:35.75, go:80.32, oi:67.21, perception:2.84},
  {rank:25, college:"Bhaskaracharya College of Applied Sciences",          indiaRank:45, score:60.20, tlr:64.53,   rpc:87.99, go:57.73, oi:52.88, perception:14.70},
  {rank:26, college:"Kamala Nehru College",                                indiaRank:58, score:58.22, tlr:59.40,   rpc:15.63, go:89.38, oi:75.45, perception:22.23},
  {rank:27, college:"Shaheed Rajguru College of Applied Sciences for Women", indiaRank:65, score:57.59, tlr:64.36, rpc:53.96, go:66.38, oi:69.83, perception:1.91},
  {rank:28, college:"Shivaji College",                                     indiaRank:69, score:57.48, tlr:55.88,   rpc:63.33, go:76.83, oi:61.36, perception:2.84},
  {rank:29, college:"Jesus & Mary College (JMC)",                         indiaRank:85, score:55.66, tlr:61.13,   rpc:11.77, go:78.19, oi:68.37, perception:30.54},
  {rank:30, college:"Ram Lal Anand College",                               indiaRank:90, score:55.10, tlr:67.77,   rpc:25.20, go:69.97, oi:65.26, perception:1.91},
  {rank:31, college:"Keshav Mahavidyalaya",                                indiaRank:95, score:54.61, tlr:65.38,   rpc:44.89, go:62.75, oi:55.82, perception:4.63},
  {rank:32, college:"PGDAV College",                                       indiaRank:97, score:54.52, tlr:67.60,   rpc:39.65, go:60.06, oi:57.19, perception:7.99},
];

const marketRankingData = [
  {rank:1,  college:"St. Stephen's College",                              tier:"Tier 1 — Dream colleges",    womens:false},
  {rank:2,  college:"Shri Ram College of Commerce (SRCC)",               tier:"Tier 1 — Dream colleges",    womens:false},
  {rank:3,  college:"Hindu College",                                      tier:"Tier 1 — Dream colleges",    womens:false},
  {rank:4,  college:"Lady Shri Ram College (LSR)",                        tier:"Tier 1 — Dream colleges",    womens:true},
  {rank:5,  college:"Hansraj College",                                    tier:"Tier 1 — Dream colleges",    womens:false},
  {rank:6,  college:"Miranda House",                                      tier:"Tier 1 — Dream colleges",    womens:true},
  {rank:7,  college:"Shaheed Sukhdev College of Business Studies (SSCBS)",tier:"Tier 2 — Elite specialists", womens:false},
  {rank:8,  college:"Kirori Mal College (KMC)",                          tier:"Tier 2 — Elite specialists", womens:false},
  {rank:9,  college:"Ramjas College",                                     tier:"Tier 2 — Elite specialists", womens:false},
  {rank:10, college:"Sri Venkateswara College",                          tier:"Tier 2 — Elite specialists", womens:false},
  {rank:11, college:"Jesus & Mary College (JMC)",                        tier:"Tier 2 — Elite specialists", womens:true},
  {rank:12, college:"Gargi College",                                      tier:"Tier 2 — Elite specialists", womens:true},
  {rank:13, college:"ARSD College",                                       tier:"Tier 3 — High-demand",       womens:false},
  {rank:14, college:"Shaheed Bhagat Singh College",                       tier:"Tier 3 — High-demand",       womens:false},
  {rank:15, college:"Daulat Ram College",                                  tier:"Tier 3 — High-demand",       womens:true},
  {rank:16, college:"Indraprastha College for Women (IP)",                tier:"Tier 3 — High-demand",       womens:true},
  {rank:17, college:"College of Vocational Studies (CVS)",                tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:18, college:"Delhi College of Arts & Commerce (DCAC)",           tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:19, college:"Kamala Nehru College",                               tier:"Tier 3 — High-demand",       womens:true},
  {rank:20, college:"Deen Dayal Upadhyaya College (DDU)",                tier:"Tier 3 — High-demand",       womens:false},
  {rank:21, college:"Maitreyi College",                                   tier:"Tier 3 — High-demand",       womens:true},
  {rank:22, college:"Sri Guru Tegh Bahadur Khalsa College (SGTB)",       tier:"Tier 3 — High-demand",       womens:false},
  {rank:23, college:"Sri Guru Gobind Singh College of Commerce (SGGSCC)",tier:"Tier 3 — High-demand",       womens:false},
  {rank:24, college:"Deshbandhu College",                                 tier:"Tier 3 — High-demand",       womens:false},
  {rank:25, college:"Dyal Singh College",                                 tier:"Tier 3 — High-demand",       womens:false},
  {rank:26, college:"Acharya Narendra Dev College",                       tier:"Tier 3 — High-demand",       womens:false},
  {rank:27, college:"Shivaji College",                                    tier:"Tier 3 — High-demand",       womens:false},
  {rank:28, college:"Bhaskaracharya College of Applied Sciences",         tier:"Tier 3 — High-demand",       womens:false},
  {rank:29, college:"Aryabhatta College",                                  tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:30, college:"Maharaja Agrasen College",                           tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:31, college:"Ram Lal Anand College",                              tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:32, college:"PGDAV College",                                      tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:33, college:"Motilal Nehru College",                              tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:34, college:"Sri Aurobindo College",                              tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:35, college:"Ramanujan College",                                   tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:36, college:"Keshav Mahavidyalaya",                               tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:37, college:"Shaheed Rajguru College of Applied Sciences for Women",tier:"Tier 4 — Solid mid-tier", womens:true},
  {rank:38, college:"Shyam Lal College",                                  tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:39, college:"Satyawati College",                                   tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:40, college:"Zakir Husain Delhi College",                          tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:41, college:"Rajdhani College",                                    tier:"Tier 4 — Solid mid-tier",    womens:false},
  {rank:42, college:"Vivekananda College",                                 tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:43, college:"Janki Devi Memorial College (JDMC)",                 tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:44, college:"Kalindi College",                                     tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:45, college:"Lakshmibai College",                                  tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:46, college:"Shyama Prasad Mukherji College (SPM)",               tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:47, college:"Institute of Home Economics",                         tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:48, college:"Lady Irwin College",                                  tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:49, college:"Mata Sundri College for Women",                       tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:50, college:"Bharati College",                                     tier:"Tier 4 — Solid mid-tier",    womens:true},
  {rank:51, college:"Swami Shraddhanand College",                          tier:"Tier 5 — Regular",           womens:false},
  {rank:52, college:"Dr. Bhim Rao Ambedkar College",                      tier:"Tier 5 — Regular",           womens:false},
  {rank:53, college:"Sri Guru Nanak Dev Khalsa College",                  tier:"Tier 5 — Regular",           womens:false},
  {rank:54, college:"Bhagini Nivedita College",                            tier:"Tier 5 — Regular",           womens:true},
  {rank:55, college:"Aditi Mahavidyalaya",                                 tier:"Tier 5 — Regular",           womens:true},
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

  return (
    <div className="rankings-container">
      <div className="rankings-hero">
        <div className="rankings-hero-bg" aria-hidden="true">
          <div className="rankings-hero-blob rankings-hero-blob-1" />
          <div className="rankings-hero-blob rankings-hero-blob-2" />
          <div className="rankings-hero-blob rankings-hero-blob-3" />
          <div className="rankings-hero-grid" />
        </div>
        <div className="rankings-hero-content">
          <span className="rankings-herobadge">CUET 2026 · Rankings</span>
          <h1 className="rankings-title">College Rankings</h1>
          <p className="rankings-subtitle">Discover the top performing institutions across Delhi University. View official NIRF rankings or explore our reputation-based market index.</p>
        </div>
        <div className="rankings-hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="100" r="80" fill="url(#hero-grad-bg)" opacity="0.15" />
            <circle cx="160" cy="70" r="50" fill="url(#hero-grad-glow)" opacity="0.2" filter="blur(10px)" />
            
            <g filter="url(#card-shadow)">
              <rect x="20" y="30" width="160" height="90" rx="16" fill="white" fillOpacity="0.12" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" style={{ backdropFilter: 'blur(8px)' }} />
              <rect x="36" y="46" width="48" height="8" rx="4" fill="white" opacity="0.8" />
              <circle cx="156" cy="50" r="6" fill="#10b981" />
              <rect x="36" y="66" width="100" height="5" rx="2.5" fill="white" opacity="0.4" />
              <rect x="36" y="78" width="112" height="5" rx="2.5" fill="white" opacity="0.4" />
              <rect x="36" y="90" width="76" height="5" rx="2.5" fill="white" opacity="0.4" />
            </g>

            <g filter="url(#card-shadow-large)">
              <rect x="80" y="100" width="140" height="64" rx="16" fill="white" fillOpacity="0.95" />
              <circle cx="106" cy="132" r="14" fill="#eff6ff" />
              <path d="M101 132l3 3 7-7" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              
              <rect x="132" y="122" width="72" height="7" rx="3.5" fill="#1e293b" />
              <rect x="132" y="135" width="48" height="5" rx="2.5" fill="#64748b" />
            </g>
            
            <defs>
              <linearGradient id="hero-grad-bg" x1="40" y1="20" x2="200" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="hero-grad-glow" x1="110" y1="20" x2="210" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <filter id="card-shadow" x="10" y="24" width="180" height="110" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.15" />
              </filter>
              <filter id="card-shadow-large" x="70" y="94" width="160" height="84" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.25" />
              </filter>
            </defs>
          </svg>
        </div>
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
          Market Ranking
        </button>
      </div>

      {activeTab === 'nirf' && (
        <div className="tab-content">
          <div className="rankings-list">
            {nirfData.map((item) => (
              <div key={item.rank} className="rankings-row" style={{ position: 'relative' }}>
                <div className="rank-badge">{getMedal(item.rank)}</div>
                <img 
                  src={`https://placehold.co/48x48?text=${encodeURIComponent(item.college.charAt(0))}`} 
                  alt={item.college} 
                  className="rankings-img" 
                />
                <div className="rankings-info">
                  <div className="rankings-name" style={{ marginBottom: '2px' }}>
                    {item.college}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    #{item.indiaRank} India
                  </div>
                  <div 
                    className="rankings-score-container" 
                    title={`TLR: ${item.tlr} | RPC: ${item.rpc} | GO: ${item.go} | OI: ${item.oi} | Perception: ${item.perception}`}
                  >
                    <div className="rankings-progress-bg">
                      <div className="rankings-progress-bar" style={{ width: `${item.score}%` }}></div>
                    </div>
                    <span className="rankings-score-val">{item.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rankings-disclaimer">
            <strong>Source:</strong> NIRF 2025, Ministry of Education, Govt. of India. Rankings shown are for the 'Colleges' category only. Visit nirf.org for full data.
          </div>
        </div>
      )}

      {activeTab === 'reputation' && (
        <div className="tab-content">
          <div className="rankings-methodology">
            <h3 className="methodology-title">How this is calculated</h3>
            <p className="methodology-text">
              Reputation-based market ranking of DU day colleges. NOT a government or NIRF ranking. Based on admissions demand, placement perception, and peer reputation signals.
            </p>
          </div>

          <div className="rankings-list">
            {marketRankingData.map((item) => {
              let tierColor = 'var(--text-secondary)';
              let tierBg = 'var(--surface-variant)';
              if (item.tier.includes('Tier 1')) { tierColor = '#b8860b'; tierBg = 'rgba(184, 134, 11, 0.1)'; }
              else if (item.tier.includes('Tier 2')) { tierColor = '#1e90ff'; tierBg = 'rgba(30, 144, 255, 0.1)'; }
              else if (item.tier.includes('Tier 3')) { tierColor = '#2e8b57'; tierBg = 'rgba(46, 139, 87, 0.1)'; }
              else if (item.tier.includes('Tier 4')) { tierColor = '#808080'; tierBg = 'rgba(128, 128, 128, 0.1)'; }
              else if (item.tier.includes('Tier 5')) { tierColor = '#a9a9a9'; tierBg = 'rgba(169, 169, 169, 0.1)'; }

              return (
                <div key={item.rank} className="rankings-row" style={{ position: 'relative' }}>
                  <div className="rank-badge">{getMedal(item.rank)}</div>
                  <img 
                    src={`https://placehold.co/48x48?text=${encodeURIComponent(item.college.charAt(0))}`} 
                    alt={item.college} 
                    className="rankings-img" 
                  />
                  <div className="rankings-info">
                    <div className="rankings-name" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      {item.college}
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        backgroundColor: tierBg, 
                        color: tierColor,
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.tier}
                      </span>
                      {item.womens && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          backgroundColor: 'rgba(219, 112, 147, 0.1)', 
                          color: '#db7093',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}>
                          ♀ Women's
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
