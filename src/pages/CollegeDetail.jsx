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
  const photoUrl = `https://placehold.co/800x300?text=${encodeURIComponent(college.name)}`;

  return (
    <div className="college-detail-container">
      {/* 1. Header */}
      <section className="cd-header">
        <h1>{college.name}</h1>
        <div className="cd-subtitle">{college.campus} Campus · {college.type}</div>
        <a 
          href={college.officialWebsite} 
          target="_blank" 
          rel="noopener noreferrer"
          className="cd-official-link"
        >
          Official website ↗
        </a>
      </section>

      {/* 2a. College Photo */}
      <section className="cd-photo-section">
        <img src={photoUrl} alt={college.name} className="cd-banner-photo" />
      </section>

      {/* 2b. College Introduction */}
      <section className="cd-intro-section">
        <p className="cd-intro-text">{college.intro}</p>
      </section>

      {/* 2. Key facts row */}
      <section className="cd-facts-row">
        <div className="cd-fact-box">
          <span className="cd-fact-value">{totalCollegeSeats}</span>
          <span className="cd-fact-label">Total Seats</span>
        </div>
        <div className="cd-fact-box">
          <span className="cd-fact-value">{totalCourses}</span>
          <span className="cd-fact-label">Courses Offered</span>
        </div>
        <div className="cd-facilities">
          {college.facilities && college.facilities.map(facility => (
            <span key={facility} className="cd-facility-tag">{facility}</span>
          ))}
        </div>
      </section>

      {/* 3. Courses Accordion (Grouped by Stream) */}
      <section className="cd-courses-accordion">
        {['Science', 'Commerce', 'Humanities', 'Others'].map(stream => {
          const courses = groupedOfferings[stream];
          if (courses.length === 0) return null;

          return (
            <div key={stream} className="cd-stream-group">
              <h2 className="cd-stream-title">{stream} Programs</h2>
              
              <div className="cd-accordion-list">
                {courses.map(offering => {
                  const isExpanded = !!expandedCourseIds[offering.programId];
                  const cutoffs = offering.cutoffsByCategoryAndRound || {};

                  return (
                    <div key={offering.programId} className={`cd-accordion-item ${isExpanded ? 'expanded' : ''}`}>
                      <div 
                        className="cd-accordion-header"
                        onClick={() => toggleAccordion(offering.programId)}
                      >
                        <span className="cd-course-name">{offering.programDetails.name}</span>
                        <span className="cd-toggle-icon">{isExpanded ? '▲ hide' : '▼ expand'}</span>
                      </div>
                      
                      {isExpanded && (
                        <div className="cd-accordion-content">
                          
                          <div className="cd-sub-section">
                            <h3 className="cd-sub-title">Seat Matrix <SourceBadge date="Aug 2023" /></h3>
                            <div className="cd-matrix-grid">
                              {Object.entries(offering.seatsByCategory || {}).map(([category, seats]) => (
                                <div key={category} className="cd-matrix-item">
                                  <div className="cd-matrix-category">{category}</div>
                                  <div className="cd-matrix-seats">{seats}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="cd-sub-section">
                            <h3 className="cd-sub-title">Eligibility Criteria</h3>
                            <div className="cd-eligibility-box">
                              {offering.programDetails.eligibility}
                            </div>
                          </div>

                          <div className="cd-sub-section">
                            <h3 className="cd-sub-title">Category-wise Cutoffs (Round 1, 2025) <SourceBadge date="Aug 2023" /></h3>
                            <div className="cd-table-wrapper">
                              <table className="cd-sub-table">
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

      {/* 4. Location with Map */}
      <section className="cd-location-section">
        <h2 className="cd-section-title">Location</h2>
        <div className="cd-map-wrapper">
          <MapContainer 
            center={[college.coordinates.lat, college.coordinates.lng]} 
            zoom={15} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[college.coordinates.lat, college.coordinates.lng]}>
              <Popup className="map-popup-content">
                <h3 className="map-popup-title" style={{margin:0, fontSize: '1rem'}}>{college.name}</h3>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
