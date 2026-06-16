import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import { offerings } from '../data/offerings';
import { SourceBadge } from '../components/SourceBadge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './CollegeDetail.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const getStreamGroup = (subjectGroup) => {
  if (!subjectGroup) return 'Others';
  if (subjectGroup.includes('Science')) return 'Science';
  if (subjectGroup.includes('Commerce')) return 'Commerce';
  if (subjectGroup.includes('Humanities') || subjectGroup.includes('Arts') || subjectGroup.includes('Social')) return 'Humanities';
  return 'Others';
};

const avatarColors = ['#2563eb','#059669','#7c3aed','#e11d48','#d97706','#0891b2'];
const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export function CollegeDetail() {
  const { id } = useParams();
  const college = useMemo(() => colleges.find(c => c.id === id), [id]);
  
  const collegeOfferings = useMemo(() => {
    if (!college) return [];
    return offerings
      .filter(o => o.collegeId === id)
      .map(o => {
        const program = programs.find(p => p.id === o.programId);
        return {
          ...o,
          programDetails: program || {}
        };
      });
  }, [id, college]);

  const groupedOfferings = useMemo(() => {
    const groups = { Science: [], Commerce: [], Humanities: [], Others: [] };
    collegeOfferings.forEach(off => {
      const stream = getStreamGroup(off.programDetails.subjectGroup);
      groups[stream].push(off);
    });
    return groups;
  }, [collegeOfferings]);

  const [expandedCourseIds, setExpandedCourseIds] = useState({});

  const toggleAccordion = (courseId) => {
    setExpandedCourseIds(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (!college) {
    return (
      <div className="container cd-not-found">
        <h2>College not found</h2>
        <Link to="/colleges" className="cd-back-link">Back to Colleges</Link>
      </div>
    );
  }

  const totalCollegeSeats = collegeOfferings.reduce((sum, o) => sum + o.totalSeats, 0);
  const totalCourses = collegeOfferings.length;
  // Use the specific scraped image URL from college data, or fallback
  const heroImageUrl = college.imageUrl || `https://placehold.co/1200x500?text=${encodeURIComponent(college.name)}`;

  return (
    <div className="college-detail-container">
      {/* 1. Dynamic Hero Section */}
      <section className="cd-hero-section" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="cd-hero-overlay"></div>
        <div className="cd-hero-content">
          <Link to="/colleges" className="cd-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Explore
          </Link>
          <h1 className="cd-hero-title">{college.name}</h1>
          <div className="cd-hero-meta">
            <span className="cd-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {college.campus} Campus
            </span>
            <span className="cd-meta-divider">•</span>
            <span className="cd-meta-item">{college.type}</span>
          </div>
        </div>
      </section>

      <div className="cd-main-content">
        {/* 2. Premium Quick Stats */}
        <section className="cd-stats-row">
          <div className="cd-stat-card">
            <div className="cd-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="cd-stat-info">
              <span className="cd-stat-value">{totalCollegeSeats}</span>
              <span className="cd-stat-label">Total Seats</span>
            </div>
          </div>
          
          <div className="cd-stat-card">
            <div className="cd-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <div className="cd-stat-info">
              <span className="cd-stat-value">{totalCourses}</span>
              <span className="cd-stat-label">Courses Offered</span>
            </div>
          </div>
          
          <a href={college.officialWebsite} target="_blank" rel="noopener noreferrer" className="cd-stat-card cd-website-card">
            <div className="cd-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div className="cd-stat-info">
              <span className="cd-stat-value">Official Website</span>
              <span className="cd-stat-label">Visit portal ↗</span>
            </div>
          </a>
        </section>

        {/* Introduction */}
        <section className="cd-intro-section">
          <h2 className="cd-section-title">About College</h2>
          <p className="cd-intro-text">{college.intro}</p>
          
          {college.facilities && college.facilities.length > 0 && (
            <div className="cd-facilities-container">
              <h3 className="cd-facilities-title">Key Facilities</h3>
              <div className="cd-facilities-list">
                {college.facilities.map(facility => (
                  <span key={facility} className="cd-facility-pill">
                    {facility === 'Hostel' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>}
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. Redesigned Courses Accordion */}
        <section className="cd-courses-section">
          <h2 className="cd-section-title">Programs & Cutoffs</h2>
          
          {['Science', 'Commerce', 'Humanities', 'Others'].map(stream => {
            const courses = groupedOfferings[stream];
            if (courses.length === 0) return null;

            return (
              <div key={stream} className="cd-stream-group">
                <h3 className="cd-stream-title">{stream} Programs</h3>
                
                <div className="cd-accordion-container">
                  {courses.map(offering => {
                    const isExpanded = !!expandedCourseIds[offering.programId];
                    const cutoffs = offering.cutoffsByCategoryAndRound || {};

                    return (
                      <div key={offering.programId} className={`cd-accordion-item ${isExpanded ? 'expanded' : ''}`}>
                        <div className="cd-accordion-header" onClick={() => toggleAccordion(offering.programId)}>
                          <div className="cd-course-title-wrapper">
                            <span className="cd-course-name">{offering.programDetails.name}</span>
                            <span className="cd-course-seats-badge">{offering.totalSeats} Seats</span>
                          </div>
                          <div className={`cd-accordion-icon ${isExpanded ? 'rotated' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="cd-accordion-body">
                            
                            <div className="cd-details-grid">
                              <div className="cd-detail-card">
                                <h4>Seat Matrix <SourceBadge date="Aug 2023" /></h4>
                                <div className="cd-matrix-tags">
                                  {Object.entries(offering.seatsByCategory || {}).map(([category, seats]) => (
                                    <div key={category} className="cd-matrix-tag">
                                      <span className="cat">{category}</span>
                                      <span className="val">{seats}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="cd-detail-card cd-eligibility-card">
                                <h4>Eligibility Criteria</h4>
                                <p>{offering.programDetails.eligibility}</p>
                              </div>
                            </div>

                            <div className="cd-detail-card cd-cutoffs-card">
                              <h4>Category-wise Cutoffs (Round 1, 2025) <SourceBadge date="Aug 2023" /></h4>
                              <div className="cd-table-responsive">
                                <table className="cd-premium-table">
                                  <thead>
                                    <tr>
                                      <th>UR</th>
                                      <th>OBC-NCL</th>
                                      <th>SC</th>
                                      <th>ST</th>
                                      <th>EWS</th>
                                      <th>PwBD</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{cutoffs.General?.round1 || '-'}</td>
                                      <td>{cutoffs.OBC?.round1 || '-'}</td>
                                      <td>{cutoffs.SC?.round1 || '-'}</td>
                                      <td>{cutoffs.ST?.round1 || '-'}</td>
                                      <td>{cutoffs.EWS?.round1 || '-'}</td>
                                      <td>{cutoffs.PwBD?.round1 || '-'}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* 4. Interactive Map */}
        <section className="cd-location-section">
          <h2 className="cd-section-title">Location & Map</h2>
          <div className="cd-map-premium-wrapper">
            <MapContainer 
              center={[college.coordinates.lat, college.coordinates.lng]} 
              zoom={15} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[college.coordinates.lat, college.coordinates.lng]}>
                <Popup className="map-popup-custom">
                  <strong>{college.name}</strong><br/>
                  {college.campus} Campus
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>

        {/* Section A - Notable Alumni */}
        <section className="cd-alumni-section">
          <h2 className="cd-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-blue)' }}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            Notable Alumni
          </h2>
          <div className="cd-alumni-scroll">
            {(!college.notableAlumni || college.notableAlumni.length === 0) ? (
              <div className="cd-alumni-card cd-alumni-placeholder">
                Alumni data being compiled
              </div>
            ) : (
              college.notableAlumni.map((alumni, idx) => (
                <div key={idx} className="cd-alumni-card">
                  <div className="cd-alumni-avatar" style={{ backgroundColor: getAvatarColor(alumni.name) }}>
                    {getInitials(alumni.name)}
                  </div>
                  <div className="cd-alumni-name">{alumni.name}</div>
                  <div className="cd-alumni-field">{alumni.field}</div>
                  <div className="cd-alumni-year">{alumni.year}</div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section B - Societies & Clubs */}
        <section className="cd-societies-section">
          <h2 className="cd-section-title">Societies & Clubs</h2>
          <div className="cd-societies-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(!college.societies || college.societies.length === 0) ? (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Society info coming soon</span>
            ) : (
              college.societies.map((soc, idx) => (
                <span key={idx} className="cd-society-pill">
                  {soc}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Section C - Annual Fests */}
        <section className="cd-fests-section">
          <h2 className="cd-section-title">Annual Fests</h2>
          <div className="cd-fests-grid">
            {(!college.fests || college.fests.length === 0) ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1rem', color: '#94a3b8' }}>Fest data being updated</div>
            ) : (
              college.fests.map((fest, idx) => {
                let badgeBg = '#f1f5f9';
                let badgeColor = '#475569';
                if (fest.type === 'Cultural') { badgeBg = '#f5f3ff'; badgeColor = '#7c3aed'; }
                else if (fest.type === 'Literary') { badgeBg = '#ecfdf5'; badgeColor = '#059669'; }
                else if (fest.type === 'Sports') { badgeBg = '#fff1f2'; badgeColor = '#e11d48'; }
                else if (fest.type === 'Commerce & Management') { badgeBg = '#fffbeb'; badgeColor = '#d97706'; }
                else if (fest.type === 'Music' || fest.type === 'Debate' || fest.type === 'Social' || fest.type === 'Humanities') { badgeBg = '#eff6ff'; badgeColor = '#2563eb'; }

                return (
                  <div key={idx} className="cd-fest-card">
                    <div className="cd-fest-name">{fest.name}</div>
                    <div className="cd-fest-meta">
                      <span className="cd-fest-type-badge" style={{ backgroundColor: badgeBg, color: badgeColor }}>{fest.type}</span>
                      <span className="cd-fest-month">{fest.month}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Section D - Nearest Metro */}
        <section className="cd-metro-section" style={{ marginBottom: '2rem' }}>
          <h2 className="cd-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="4" y="3" width="16" height="16" rx="2" ry="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="M8 19l-2 3"></path><path d="M18 22l-2-3"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path></svg>
            Getting There
          </h2>
          <div className="cd-metro-card">
            {(!college.nearestMetro || college.nearestMetro.station === "Check college website") ? (
              <div style={{ color: 'var(--text-muted)' }}>Metro info not available — check Google Maps</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="cd-metro-station">{college.nearestMetro.station}</div>
                <div className="cd-metro-details">
                  <span className="cd-metro-line-pill" style={{ backgroundColor: `${college.nearestMetro.lineColor}15`, color: college.nearestMetro.lineColor, border: `1px solid ${college.nearestMetro.lineColor}40` }}>
                    {college.nearestMetro.line}
                  </span>
                  <span className="cd-metro-walk">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {college.nearestMetro.walkTime}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
