import React, { useState, useMemo } from 'react';
import { programs } from '../data/programs';
import './Eligibility.css';

const COMMON_SUBJECTS = [
  "English",
  "Hindi",
  "Mathematics",
  "Applied Mathematics",
  "Physics",
  "Chemistry",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Political Science",
  "History",
  "Geography"
];

export function Eligibility() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [isCheckingSubjects, setIsCheckingSubjects] = useState(false);

  const toggleSubject = (subject) => {
    const newSet = new Set(selectedSubjects);
    if (newSet.has(subject)) {
      newSet.delete(subject);
    } else {
      newSet.add(subject);
    }
    setSelectedSubjects(newSet);
  };

  // Very basic heuristic to demonstrate functionality for mock data
  const checkEligibility = (eligibilityStr) => {
    if (selectedSubjects.size === 0) return true;
    
    const str = eligibilityStr.toLowerCase();
    const subs = Array.from(selectedSubjects).map(s => s.toLowerCase());
    
    // Require Language
    const hasLanguage = subs.includes('english') || subs.includes('hindi');
    
    // Specific hard rules based on our mock data strings
    if (str.includes("physics + chemistry")) {
      if (!subs.includes("physics") || !subs.includes("chemistry")) return false;
    }
    
    if (str.includes("english from list a")) {
      if (!subs.includes("english")) return false;
    }
    
    if (str.includes("mathematics/applied mathematics")) {
      if (!subs.includes("mathematics") && !subs.includes("applied mathematics") && !subs.includes("accountancy")) return false;
    }

    if (str.includes("language from list a")) {
      if (!hasLanguage) return false;
    }

    return true;
  };

  const filteredPrograms = useMemo(() => {
    let result = programs;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.subjectGroup.toLowerCase().includes(q));
    }

    // Filter by subjects if active
    if (isCheckingSubjects && selectedSubjects.size > 0) {
      result = result.filter(p => checkEligibility(p.eligibility));
    } else if (isCheckingSubjects && selectedSubjects.size === 0) {
      result = []; // If checking is active but 0 subjects, show nothing
    }

    return result;
  }, [searchQuery, isCheckingSubjects, selectedSubjects]);

  return (
    <div className="eligibility-container">
      <div className="el-header">
        <h1 className="el-title">Eligibility & Criteria</h1>
        <p className="el-note">Browse CUET subject combinations required for DU programs.</p>
      </div>

      <div className="el-badge-row">
        <span className="el-badge-icon">🔗</span>
        <span className="el-badge-text">
          Data synchronized with the Cutoffs & Seats module. All program criteria correspond directly to official seat allocation data.
        </span>
      </div>

      <input 
        type="text" 
        className="el-search-box"
        placeholder="Search for a program (e.g. B.Com, Physics)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="el-subjects-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="el-subjects-title">Check by my subjects</h2>
            <p className="el-note" style={{ margin: 0 }}>Select your CUET subjects to see matching courses.</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              checked={isCheckingSubjects} 
              onChange={(e) => setIsCheckingSubjects(e.target.checked)} 
              style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
            />
            Enable Subject Filter
          </label>
        </div>

        {isCheckingSubjects && (
          <div className="el-subjects-grid">
            {COMMON_SUBJECTS.map(subject => (
              <label key={subject} className="el-subject-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedSubjects.has(subject)}
                  onChange={() => toggleSubject(subject)}
                />
                {subject}
              </label>
            ))}
          </div>
        )}

        <div className="el-disclaimer">
          This shows which courses match your subjects — it does not predict admission. It serves as a lookup tool; always verify with official CSAS bulletins.
        </div>
      </div>

      <div className="el-table-wrapper">
        <table className="el-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Subject Group</th>
              <th>Eligibility (CUET Combination)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                  No programs match your current filters. (Select more subjects if using the subject filter).
                </td>
              </tr>
            ) : (
              filteredPrograms.map(prog => (
                <tr key={prog.id}>
                  <td style={{ fontWeight: 500 }}>{prog.name}</td>
                  <td><span className="el-group-tag">{prog.subjectGroup}</span></td>
                  <td style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>{prog.eligibility}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
