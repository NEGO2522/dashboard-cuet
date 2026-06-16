import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import { offerings } from '../data/offerings';
import { initialNews } from '../data/news';
import './Home.css';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // News logic
  const [newsList, setNewsList] = useState(initialNews);
  const [activeNewsTab, setActiveNewsTab] = useState("All");
  
  const [adminTitle, setAdminTitle] = useState("");
  const [adminLink, setAdminLink] = useState("");
  const [adminSource, setAdminSource] = useState("DU Official");
  const [adminCategory, setAdminCategory] = useState("Admission");
  const [adminImportant, setAdminImportant] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    setCurrentTimeStr(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, []);

  const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

  const filteredNews = useMemo(() => {
    if (activeNewsTab === "All") return newsList;
    if (activeNewsTab === "Admission") return newsList.filter(n => n.category === "Admission");
    if (activeNewsTab === "Notices") return newsList.filter(n => n.category === "Notice");
    if (activeNewsTab === "Features") return newsList.filter(n => n.category === "Feature");
    if (activeNewsTab === "Cutoffs") return newsList.filter(n => n.category === "Cutoffs");
    return newsList;
  }, [newsList, activeNewsTab]);

  const hasDUOfficial = newsList.some(n => n.source === "DU Official");

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminTitle || !adminLink) return;
    
    const newItem = {
      id: Date.now(),
      title: adminTitle,
      link: adminLink,
      source: adminSource,
      category: adminCategory,
      isImportant: adminImportant,
      date: new Date().toISOString(),
      imageUrl: adminSource === "DU Official" 
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Front_Lawn_and_College..JPG/1080px-Front_Lawn_and_College..JPG"
        : "https://www.dusquad.com/wp-content/uploads/2023/02/Lady-Shri-Ram-College-for-Women.jpg"
    };
    
    setNewsList([newItem, ...newsList]);
    setAdminTitle("");
    setAdminLink("");
    setAdminImportant(false);
  };

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
    <div className="home-page">
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

      {/* Stats Bar */}
      <div className="home-stats-bar">
        <div className="stat-item">
          <span className="stat-value">91</span>
          <span className="stat-label">Colleges</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">262+</span>
          <span className="stat-label">Programs</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">2025</span>
          <span className="stat-label">Data</span>
        </div>
      </div>

      <div className="home-container">
        {/* Main Navigation Grid */}
        <section className="nav-tile-grid">
          <Link to="/colleges" className="nav-tile tile-colleges">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 22 7 12 2"></polygon><polyline points="2 17 2 22 22 22 22 17"></polyline><line x1="6" y1="12" x2="6" y2="17"></line><line x1="10" y1="12" x2="10" y2="17"></line><line x1="14" y1="12" x2="14" y2="17"></line><line x1="18" y1="12" x2="18" y2="17"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Explore Colleges</h3>
            <p>Browse all DU colleges, facilities, and offered courses</p>
          </div>
        </Link>
        
        <Link to="/cutoffs" className="nav-tile tile-cutoffs">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Seats & Cutoffs</h3>
            <p>Check official seat matrix and previous year cutoffs</p>
          </div>
        </Link>

        <Link to="/eligibility" className="nav-tile tile-eligibility">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Eligibility Checker</h3>
            <p>Find which courses match your CUET subjects</p>
          </div>
        </Link>

        <a href="https://cuetpro.com/preference-sheet/" target="_blank" rel="noopener noreferrer" className="nav-tile tile-preference">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Preference Sheet Maker</h3>
            <p>Create and order your CSAS preference list</p>
          </div>
        </a>

        <Link to="/map" className="nav-tile tile-map">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Campus Map</h3>
            <p>Interactive map of North, South & Off-campus colleges</p>
          </div>
        </Link>

        <Link to="/documents" className="nav-tile tile-documents">
          <div className="nav-tile-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div className="nav-tile-content">
            <h3>Documents Guide</h3>
            <p>Checklist and timeline for the complete admission process</p>
          </div>
        </Link>
      </section>

      {/* News & Updates Section */}
      <section className="news-section">
        <div className="news-header-container">
          <h2 className="news-header-title">News & Updates</h2>
          <div className="news-live-status">
            {hasDUOfficial && (
              <div className="live-indicator">
                <div className="pulsing-dot"></div>
                Live
              </div>
            )}
            <div className="sync-time">Last synced: {currentTimeStr}</div>
          </div>
        </div>

        <div className="news-tabs">
          {["All", "Admission", "Cutoffs", "Notices", "Features"].map(tab => (
            <button
              key={tab}
              className={`news-tab ${activeNewsTab === tab ? 'active' : ''}`}
              onClick={() => setActiveNewsTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="news-list">
          {filteredNews.map(news => {
            const isDU = news.source === "DU Official";
            return (
              <a 
                href={news.link} 
                target={news.link?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                key={news.id} 
                className={`news-card ${isDU ? 'source-du' : 'source-admin'}`}
              >
                {news.isImportant && (
                  <div className="priority-badge">
                    <div className="priority-dot"></div> Priority
                  </div>
                )}
                
                {news.imageUrl && (
                  <img src={news.imageUrl} alt="" className="news-image" />
                )}
                
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-source-badge">{news.source}</span>
                    <span className="news-date">{new Date(news.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h4 className="news-card-title">{news.title}</h4>
                </div>
              </a>
            );
          })}
          {filteredNews.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No updates in this category.</p>
          )}
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="admin-panel">
            <h3>Add New Update (Admin)</h3>
            <form className="admin-form" onSubmit={handleAdminSubmit}>
              <input 
                type="text" 
                className="admin-input admin-input-full" 
                placeholder="News Title" 
                value={adminTitle}
                onChange={e => setAdminTitle(e.target.value)}
                required
              />
              <input 
                type="text" 
                className="admin-input admin-input-full" 
                placeholder="Link URL" 
                value={adminLink}
                onChange={e => setAdminLink(e.target.value)}
                required
              />
              <select className="admin-input" value={adminSource} onChange={e => setAdminSource(e.target.value)}>
                <option value="DU Official">DU Official</option>
                <option value="Admin">Admin</option>
              </select>
              <select className="admin-input" value={adminCategory} onChange={e => setAdminCategory(e.target.value)}>
                <option value="Admission">Admission</option>
                <option value="Cutoffs">Cutoffs</option>
                <option value="Notice">Notice</option>
                <option value="Feature">Feature</option>
              </select>
              <label className="admin-checkbox-label admin-input-full">
                <input 
                  type="checkbox" 
                  checked={adminImportant}
                  onChange={e => setAdminImportant(e.target.checked)}
                />
                Mark as Important / Priority
              </label>
              <div className="admin-input-full">
                <button type="submit" className="admin-submit-btn">Post Update</button>
              </div>
              <p className="admin-note">⚠️ Posts save to this session only. Connect a backend to persist.</p>
            </form>
          </div>
        )}
      </section>

    </div>
    </div>
  );
}
