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
      </div>
    </div>
  );
}
