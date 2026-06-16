import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Documents.css';

const documents = [
  {id:"cuet-scorecard", label:"CUET UG 2025 Scorecard", category:"Mandatory for All", desc:"Download from nta.ac.in after result declaration", sampleUrl:"https://nta.ac.in"},
  {id:"class12-marksheet", label:"Class 12 Marksheet (Original + 2 photocopies)", category:"Mandatory for All", desc:"Board-issued marksheet with official seal"},
  {id:"class10-marksheet", label:"Class 10 Marksheet / DOB Certificate", category:"Mandatory for All", desc:"For date of birth proof"},
  {id:"class12-passing-cert", label:"Class 12 Passing Certificate", category:"Mandatory for All", desc:"Some boards issue separately from marksheet"},
  {id:"character-cert", label:"Character Certificate", category:"Mandatory for All", desc:"Issued by your Class 12 school principal, with school seal"},
  {id:"migration-cert", label:"Migration Certificate", category:"Mandatory for All", desc:"Required if Class 12 board is NOT CBSE — get from your State Board"},
  {id:"passport-photo", label:"Passport-size Photographs (6 copies)", category:"Mandatory for All", desc:"White background, recent, matching CUET form photo"},
  {id:"aadhar", label:"Aadhaar Card / Voter ID / Passport", category:"Mandatory for All", desc:"Any one government-issued photo ID"},
  {id:"csas-allotment-letter", label:"CSAS Seat Allotment Letter", category:"Mandatory for All", desc:"Download from admission.uod.ac.in after seat allocation"},
  {id:"obc-cert", label:"OBC-NCL Certificate (Non-Creamy Layer)", category:"If OBC-NCL", desc:"Issued within last 6 months. Must explicitly state Non-Creamy Layer. From tehsildar or above."},
  {id:"sc-cert", label:"SC Caste Certificate", category:"If SC", desc:"Central Govt. format. From tehsildar or SDM."},
  {id:"st-cert", label:"ST Tribe Certificate", category:"If ST", desc:"From tehsildar or SDM."},
  {id:"ews-cert", label:"EWS Income & Asset Certificate", category:"If EWS", desc:"Must be issued in the CURRENT financial year. From tehsildar/SDM."},
  {id:"pwbd-cert", label:"PwBD Disability Certificate", category:"If PwBD", desc:"From government hospital / medical board. Must state percentage disability."},
  {id:"eca-cert", label:"ECA Achievement Certificates", category:"If ECA Quota", desc:"Original certificates for cultural/literary/music/dance activities from last 3 years"},
  {id:"sports-cert", label:"Sports Achievement Certificate", category:"If Sports Quota", desc:"National/State/District level. Follow format specified in CSAS bulletin."},
  {id:"defence-cert", label:"Defence Dependent Certificate", category:"If Defence/CW Quota", desc:"From Army/Navy/Air Force records office"},
];

const steps = [
  {id:1, phase:"Before Applying", title:"Give CUET UG Exam", icon:"📝", color:"#2563eb",
   summary:"Register and appear for CUET UG on nta.ac.in. Your score is your admission currency.",
   details:"CUET UG is conducted by NTA. You must choose:\n• 1 Language subject (List A — e.g. English, Hindi)\n• Up to 6 Domain subjects (List B — e.g. Physics, Accountancy)\n• 1 General Test (optional)\nYour CUET score out of 800-1000 is used for DU merit lists.",
   link:"https://nta.ac.in", linkLabel:"NTA CUET Portal"},

  {id:2, phase:"Before Applying", title:"Check Your Eligibility", icon:"✅", color:"#059669",
   summary:"Verify which DU programs you qualify for based on your CUET subjects.",
   details:"Each program needs specific CUET subjects:\n• B.Sc Physics → Physics + Chemistry/Maths\n• B.Com (Hons.) → Accountancy or Maths\n• B.A. (Hons.) English → English from List A\nUse the Eligibility Checker on this dashboard.",
   link:"/eligibility", linkLabel:"Open Eligibility Checker"},

  {id:3, phase:"CSAS Phase 1", title:"Register on CSAS Portal", icon:"🖥️", color:"#7c3aed",
   summary:"Go to admission.uod.ac.in. Register with CUET credentials and fill the CSAS form.",
   details:"Steps:\n1. Login with CUET application number\n2. Fill personal details, upload photo\n3. Declare your Category (UR/OBC-NCL/SC/ST/EWS/PwBD)\n4. Declare special quota if applicable (ECA/Sports/Defence)\n\n⚠️ Deadline is usually 2-3 weeks after CUET results. Missing it = no DU admission.",
   link:"https://admission.uod.ac.in", linkLabel:"CSAS Portal"},

  {id:4, phase:"CSAS Phase 1", title:"Build Your Preference List", icon:"📋", color:"#d97706",
   summary:"Rank your (College + Program) combinations. Most preferred at top. This is the most critical step.",
   details:"Rules:\n• You can add 50+ preferences\n• Order matters — system tries your top preference first\n• You CAN change preferences between rounds\n• Strategy: Dream college first → realistic matches → safety options\n\nUse the Preference Sheet Maker to plan.",
   link:"https://cuetpro.com/preference-sheet/", linkLabel:"Open Preference Sheet Maker"},

  {id:5, phase:"CSAS Phase 2", title:"Round 1 Seat Allocation", icon:"🎯", color:"#e11d48",
   summary:"DU releases Round 1 results. You must choose: Accept & Upgrade, Accept & Freeze, or Withdraw.",
   details:"Three options after Round 1:\n• Accept & Upgrade: Take the seat but stay in pool for Round 2\n• Accept & Freeze: This is your final college — exit all rounds\n• Withdraw: Reject seat (only if you have other options)\n\nPay acceptance fee to confirm. Partially refundable if withdrawn before deadline.",
   link:"https://admission.uod.ac.in", linkLabel:"Check Allocation"},

  {id:6, phase:"CSAS Phase 2", title:"Round 2 & Round 3 (Final)", icon:"🔄", color:"#0891b2",
   summary:"Two more rounds. If you chose Accept & Upgrade, you might get a better preference.",
   details:"Each round works like Round 1. After Round 3:\n• Whatever seat you hold is CONFIRMED\n• No more changes possible\n• Spot Round may open if seats remain — limited and competitive",
   link:null, linkLabel:null},

  {id:7, phase:"CSAS Phase 3", title:"Online Reporting & Document Upload", icon:"📁", color:"#059669",
   summary:"Upload all documents on CSAS portal. College verifies them online — no physical visit needed.",
   details:"Steps:\n1. Login → Online Reporting section\n2. Upload scanned documents (see Document Checklist tab)\n3. College approves in 24-72 hours\n4. If query raised → respond within deadline\n\n✅ Most colleges do NOT require physical reporting.",
   link:null, linkLabel:null},

  {id:8, phase:"CSAS Phase 3", title:"Pay Admission Fee", icon:"💳", color:"#7c3aed",
   summary:"Pay college fee online via CSAS. Admission only confirmed after payment.",
   details:"Fee range: ₹5,000–₹25,000 for first semester (varies by college).\nModes: Net banking, UPI, Debit/Credit card.\n\n⚠️ Fees are partially refundable if withdrawn before a specific deadline. After that — no refund.\nSave your fee receipt.",
   link:null, linkLabel:null},

  {id:9, phase:"Special Routes", title:"ECA & Sports Quota", icon:"🏆", color:"#d97706",
   summary:"5% seats reserved for outstanding cultural/sports achievement. Applied separately on CSAS.",
   details:"ECA Quota covers: Music (vocal/instrumental), Dance, Drama, Debate, Fine Arts, Creative Writing.\nProcess: Apply on CSAS → shortlisted students called for trials/auditions at college.\n\nSports Quota: National/State/District level achievements in recognized sports.\nProcess: Upload certificates → some colleges hold physical trials.",
   link:"https://admission.uod.ac.in", linkLabel:"CSAS ECA/Sports"},

  {id:10, phase:"Special Routes", title:"Category Reservation", icon:"🏛️", color:"#374151",
   summary:"SC/ST/OBC-NCL/EWS/PwBD candidates have reserved seats with lower cutoffs.",
   details:"Reservation breakdown:\n• OBC-NCL: 27% seats\n• SC: 15% seats\n• ST: 7.5% seats\n• EWS: 10% seats\n• PwBD: 5% horizontal (across all categories)\n\nKey: OBC-NCL certificate must be from current financial year. Category cutoffs are significantly lower than UR.",
   link:null, linkLabel:null},
];

const getIconSvg = (emoji) => {
  switch (emoji) {
    case '📝': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
    case '✅': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
    case '🖥️': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
    case '📋': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
    case '🎯': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
    case '🔄': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
    case '📁': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
    case '💳': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
    case '🏆': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
    case '🏛️': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 22 7 12 2"></polygon><line x1="6" y1="22" x2="6" y2="11"></line><line x1="10" y1="22" x2="10" y2="11"></line><line x1="14" y1="22" x2="14" y2="11"></line><line x1="18" y1="22" x2="18" y2="11"></line><line x1="2" y1="22" x2="22" y2="22"></line><line x1="2" y1="11" x2="22" y2="11"></line></svg>;
    default: return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
  }
};

const getCategoryColor = (cat) => {
  if (cat === "Mandatory for All") return "cat-blue";
  if (cat.includes("Quota")) return "cat-purple";
  return "cat-amber";
};

export function Documents() {
  const [activeTab, setActiveTab] = useState('checklist');
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedDocs, setExpandedDocs] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('cuetpro-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing checklist:", e);
      }
    }
  }, []);

  const handleCheck = (id) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    localStorage.setItem('cuetpro-checklist', JSON.stringify(newChecked));
  };

  const resetChecklist = () => {
    setCheckedItems({});
    localStorage.removeItem('cuetpro-checklist');
  };

  const toggleDocExpand = (id, e) => {
    e.stopPropagation();
    setExpandedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStepExpand = (id) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const printGuide = () => {
    window.print();
  };

  const docsByCategory = useMemo(() => {
    const map = {};
    documents.forEach(doc => {
      if (!map[doc.category]) map[doc.category] = [];
      map[doc.category].push(doc);
    });
    return map;
  }, []);

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = (totalChecked / documents.length) * 100;

  return (
    <div className="documents-container">
      <div className="documents-hero">
        <h1 className="documents-title">Admissions Guide</h1>
        <p className="documents-subtitle">Your complete roadmap to Delhi University admissions</p>
      </div>

      <div className="documents-tabs">
        <button 
          className={`documents-tab ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Document Checklist
        </button>
        <button 
          className={`documents-tab ${activeTab === 'buddy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buddy')}
        >
          Process Buddy
        </button>
      </div>

      {activeTab === 'checklist' && (
        <div className="tab-content">
          
          <div className="checklist-progress-card">
            <div className="checklist-progress-text">
              <span>Preparation Progress</span>
              <span>{totalChecked} of {documents.length} documents checked</span>
            </div>
            <div className="checklist-progress-bg">
              <div className="checklist-progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="checklist-list">
            {Object.entries(docsByCategory).map(([category, docs]) => (
              <div key={category} className="doc-category-section">
                <div className={`doc-category-header ${getCategoryColor(category)}`}>
                  {category}
                </div>
                
                {docs.map(doc => {
                  const isChecked = !!checkedItems[doc.id];
                  const isExpanded = !!expandedDocs[doc.id];

                  return (
                    <div key={doc.id} className={`doc-item-card ${isChecked ? 'checked' : ''}`}>
                      <div className="doc-item-header" onClick={() => handleCheck(doc.id)}>
                        <div className="doc-checkbox">
                          {isChecked && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <div className="doc-label">{doc.label}</div>
                        <div 
                          className={`doc-expand-icon ${isExpanded ? 'expanded' : ''}`}
                          onClick={(e) => toggleDocExpand(doc.id, e)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="doc-item-details">
                          <p style={{ margin: 0 }}>{doc.desc}</p>
                          {doc.sampleUrl && (
                            <a href={doc.sampleUrl} target="_blank" rel="noopener noreferrer" className="doc-sample-link">
                              View Sample <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="reset-btn-container">
            <button className="reset-checklist-btn" onClick={resetChecklist}>
              Reset Checklist
            </button>
          </div>

        </div>
      )}

      {activeTab === 'buddy' && (
        <div className="tab-content">
          <div className="timeline-header-actions">
            <button className="print-guide-btn" onClick={printGuide}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Guide
            </button>
          </div>

          <div className="timeline-container">
            {steps.map((step, index) => {
              const prevStep = index > 0 ? steps[index - 1] : null;
              const showHeader = !prevStep || prevStep.phase !== step.phase;
              const isExpanded = !!expandedSteps[step.id];

              return (
                <React.Fragment key={step.id}>
                  {showHeader && (
                    <div className="timeline-phase-header">
                      {step.phase}
                    </div>
                  )}

                  <div className="timeline-step">
                    <div className="timeline-icon-container" style={{ backgroundColor: step.color }}>
                      {getIconSvg(step.icon)}
                    </div>

                    <div 
                      className="timeline-content-card" 
                      onClick={() => toggleStepExpand(step.id)}
                      style={{ borderLeftColor: isExpanded ? step.color : 'transparent' }}
                    >
                      <div className="timeline-step-title">
                        {step.title}
                        <svg className={`doc-expand-icon ${isExpanded ? 'expanded' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <div className="timeline-step-summary">
                        {step.summary}
                      </div>

                      {isExpanded && (
                        <div className="timeline-step-details">
                          {step.details}
                          
                          {step.link && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <a 
                                href={step.link} 
                                target={step.link.startsWith('http') ? '_blank' : '_self'}
                                rel={step.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                className="timeline-step-link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {step.linkLabel} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
