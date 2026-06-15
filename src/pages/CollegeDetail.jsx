import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import { offerings } from '../data/offerings';
import { SourceBadge } from '../components/SourceBadge';
import './CollegeDetail.css';

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

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    if (collegeOfferings.length > 0 && !collegeOfferings.find(o => o.programId === selectedCourseId)) {
      setSelectedCourseId(collegeOfferings[0].programId);
    }
  }, [collegeOfferings, selectedCourseId]);

  if (!college) {
    return (
      <div className="container cd-not-found">
        <h2>College not found</h2>
        <Link to="/colleges" className="cd-back-link">Back to Colleges</Link>
      </div>
    );
  }

  const selectedOffering = collegeOfferings.find(o => o.programId === selectedCourseId);
  
  const totalCollegeSeats = collegeOfferings.reduce((sum, o) => sum + o.totalSeats, 0);
  const totalCourses = collegeOfferings.length;

  const getLatestCutoff = (cutoffs) => {
    if (!cutoffs || !cutoffs.General) return 'N/A';
    const gen = cutoffs.General;
    if (gen.round3) return gen.round3;
    if (gen.round2) return gen.round2;
    if (gen.round1) return gen.round1;
    return 'N/A';
  };

  const mockNotices = [
    { id: 1, title: 'Admissions 2023: Document Verification Schedule', date: 'Aug 12, 2023' },
    { id: 2, title: 'Hostel Allocation List - First Year', date: 'Aug 15, 2023' },
    { id: 3, title: 'Orientation Program Details', date: 'Aug 18, 2023' }
  ];

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

      {/* 3. Courses offered */}
      <section className="cd-courses-section">
        <div className="cd-section-title">
          <span>Courses Offered</span>
          <SourceBadge date="Aug 2023" />
        </div>
        {collegeOfferings.length > 0 ? (
          <div className="cd-table-wrapper">
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Seats</th>
                  <th>Last Cutoff (Gen)</th>
                </tr>
              </thead>
              <tbody>
                {collegeOfferings.map(offering => {
                  const isSelected = selectedCourseId === offering.programId;
                  const cutoff = getLatestCutoff(offering.cutoffsByCategoryAndRound);
                  
                  return (
                    <tr 
                      key={offering.programId} 
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedCourseId(offering.programId)}
                    >
                      <td>{offering.programDetails.name}</td>
                      <td>{offering.totalSeats}</td>
                      <td>{cutoff}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No courses found for this college in the current data.</p>
        )}
      </section>

      {selectedOffering && (
        <>
          {/* 4. Category-wise seat matrix */}
          <section className="cd-matrix-section">
            <h2 className="cd-section-title">Seat Matrix: {selectedOffering.programDetails.name}</h2>
            <div className="cd-matrix-grid">
              {Object.entries(selectedOffering.seatsByCategory || {}).map(([category, seats]) => (
                <div key={category} className="cd-matrix-item">
                  <div className="cd-matrix-category">{category}</div>
                  <div className="cd-matrix-seats">{seats}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Eligibility */}
          <section className="cd-eligibility-section">
            <h2 className="cd-section-title">Eligibility Criteria</h2>
            <div className="cd-eligibility-box">
              {selectedOffering.programDetails.eligibility}
            </div>
          </section>
        </>
      )}

      {/* 6. Notice board */}
      <section className="cd-notice-section">
        <h2 className="cd-section-title">Notice Board</h2>
        <p className="cd-notice-note">Official notices link + curated key updates — not a live feed.</p>
        <div className="cd-notice-list">
          {mockNotices.map(notice => (
            <div key={notice.id} className="cd-notice-item">
              <div className="cd-notice-content">
                <span className="cd-notice-title">{notice.title}</span>
                <span className="cd-notice-date">{notice.date}</span>
              </div>
              <a href="#" className="cd-official-link" onClick={e => e.preventDefault()}>View</a>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Location */}
      <section className="cd-location-section">
        <h2 className="cd-section-title">Location</h2>
        <div className="cd-location-box">
          <div className="cd-coordinates">
            {college.coordinates.lat}, {college.coordinates.lng}
          </div>
          <Link to="/map">
            <button type="button">View on map</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
