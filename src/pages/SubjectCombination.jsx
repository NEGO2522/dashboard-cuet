import React, { useMemo, useState, useEffect } from "react";

import { offerings, CATEGORIES, getCutoff, getSeats, getEligibilityForProgram } from "../data/cutoffsData";
import { colleges as REAL_COLLEGES } from "../data/colleges";
import { SourceBadge } from "../components/SourceBadge";
import "./Cutoffs.css";

/* =========================================================================
   CUET Pro — Subject Combination → Course/College Finder · "Dashboard Theme"
   Pick CUET subjects → Eligible Programs / Other Programs / Eligible Colleges.
   ========================================================================= */

const STREAMS = {
  Commerce: { label: "Commerce", color: "#2563eb" },
  Humanities: { label: "Humanities", color: "#7c3aed" },
  Science: { label: "Science", color: "#059669" },
};

const PROGRAMS = [
  { id: "b-com-hons", name: "B.Com. (Hons.)", stream: "Commerce" },
  { id: "b-a-hons-economics", name: "B.A. (Hons.) Economics", stream: "Commerce" },
  { id: "bachelor-of-management-studies-bms", name: "Bachelor of Management Studies (BMS)", stream: "Commerce" },
  { id: "bachelor-of-business-administration-financial-investment-analysis-bba-fia", name: "Bachelor of Business Administration (Financial Investment Analysis) (BBA(FIA))", stream: "Commerce" },
  { id: "b-com", name: "B.Com.", stream: "Commerce" },
  { id: "b-a-hons-psychology", name: "B.A. (Hons.) Psychology", stream: "Humanities" },
  { id: "b-a-hons-political-science", name: "B.A. (Hons.) Political Science", stream: "Humanities" },
  { id: "b-a-hons-history", name: "B.A. (Hons.) History", stream: "Humanities" },
  { id: "b-a-hons-sociology", name: "B.A. (Hons.) Sociology", stream: "Humanities" },
  { id: "b-a-hons-english", name: "B.A. (Hons.) English", stream: "Humanities" },
  { id: "b-a-hons-hindi", name: "B.A. (Hons.) Hindi", stream: "Humanities" },
  { id: "b-sc-hons-computer-science", name: "B.Sc. (Hons.) Computer Science", stream: "Science" },
  { id: "b-sc-hons-mathematics", name: "B.Sc. (Hons.) Mathematics", stream: "Science" },
  { id: "b-sc-hons-statistics", name: "B.Sc. (Hons.) Statistics", stream: "Science" },
];
const COLLEGES = [];
const RES_CATS = [
  { id: "UR", label: "UR", delta: 0, share: 0.4 }, { id: "OBC", label: "OBC", delta: 150, share: 0.27 },
  { id: "SC", label: "SC", delta: 205, share: 0.15 }, { id: "ST", label: "ST", delta: 235, share: 0.075 },
  { id: "EWS", label: "EWS", delta: 115, share: 0.1 }, { id: "PwBD", label: "PwBD", delta: 330, share: 0.05 },
];

const LANGUAGES = ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Malayalam", "Marathi", "Odia", "Punjabi", "Sanskrit", "Tamil", "Telugu", "Urdu"];
const DOMAINS = ["Accountancy / Book Keeping", "Agriculture", "Anthropology", "Biology / Biological Studies / Biotechnology / Biochemistry", "Business Studies", "Chemistry", "Computer Science / Information Practices", "Economics / Business Economics", "Environmental Studies / Environmental Science", "Fine Arts / Visual Arts / Commercial Arts", "Geography / Geology", "History", "Home Science", "Knowledge Tradition - Practices in India", "Mass Media / Mass Communication", "Mathematics / Applied Mathematics", "Performing Arts (Dance, Drama, Music)", "Physical Education (Yoga, Sports)", "Physics", "Political Science", "Psychology", "Sociology"];
const MATHS = "Mathematics / Applied Mathematics";
const ACCT = "Accountancy / Book Keeping";

const RULES = {
  "b-com-hons": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 1 }, { dom: [ACCT] }, { domAny: 2 }]],
  "b-a-hons-economics": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }]],
  "bachelor-of-management-studies-bms": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 1 }, { gt: true }]],
  "bachelor-of-business-administration-financial-investment-analysis-bba-fia": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 1 }, { gt: true }]],
  "b-com": [[{ lang: 1 }, { domAny: 3 }], [{ lang: 1 }, { domAny: 1 }, { gt: true }]],
  "b-a-hons-psychology": [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  "b-a-hons-political-science": [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  "b-a-hons-history": [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  "b-a-hons-sociology": [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  "b-a-hons-english": [[{ slang: "English" }, { domAny: 3 }], [{ slang: "English" }, { lang: 1 }, { domAny: 2 }]],
  "b-a-hons-hindi": [[{ slang: "Hindi" }, { domAny: 3 }], [{ slang: "Hindi" }, { lang: 1 }, { domAny: 2 }]],
  "b-sc-hons-computer-science": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
  "b-sc-hons-mathematics": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
  "b-sc-hons-statistics": [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
};

const ELIG = {
  "b-com-hons": [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["1 Language", "Accountancy / Book-Keeping", "+ 2 Domain"] }],
  "b-a-hons-economics": [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }],
  "bachelor-of-management-studies-bms": [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "1 Domain", "General Test"] }],
  "bachelor-of-business-administration-financial-investment-analysis-bba-fia": [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "1 Domain", "General Test"] }],
  "b-com": [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["1 Language", "1 Domain", "General Test"] }],
  "b-a-hons-psychology": [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  "b-a-hons-political-science": [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  "b-a-hons-history": [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  "b-a-hons-sociology": [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  "b-a-hons-english": [{ name: "Combination I", reqs: ["English (Language)", "3 Domain"] }, { name: "Combination II", reqs: ["English (Language)", "1 Language", "2 Domain"] }],
  "b-a-hons-hindi": [{ name: "Combination I", reqs: ["Hindi (Language)", "3 Domain"] }, { name: "Combination II", reqs: ["Hindi (Language)", "1 Language", "2 Domain"] }],
  "b-sc-hons-computer-science": [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
  "b-sc-hons-mathematics": [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
  "b-sc-hons-statistics": [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
};

function nf(n) { return n.toLocaleString("en-IN"); }
function heatBg(v) { if (!v) return "transparent"; const t = Math.max(0, Math.min(1, (v - 650) / 300)); const hue = 145 * (1 - t); return `hsla(${hue},72%,45%,0.20)`; }
function heatBgSeats(v) { if (v === null || v === undefined) return "transparent"; const t = Math.max(0, Math.min(1, v / 40)); const hue = 145 * t; return `hsla(${hue},72%,45%,0.20)`; }
function progStats(p) { const myOffs = offerings.filter(o => o.programId === p.id); return { count: myOffs.length, totalSeats: myOffs.reduce((s, o) => s + (o.seats.total || 0), 0), topCutoff: myOffs.reduce((m, o) => Math.max(m, o.cutoffs.UR || 0), 0) }; }

function comboRank(s) { return (s.gt || s.slang || s.dom) ? 0 : 1; }
function matchCombo(combo, L0, D0, gt) {
  let L = [...L0], D = [...D0];
  for (const slot of [...combo].sort((a, b) => comboRank(a) - comboRank(b))) {
    if (slot.gt) { if (!gt) return false; }
    else if (slot.slang) { const i = L.indexOf(slot.slang); if (i < 0) return false; L.splice(i, 1); }
    else if (slot.dom) { const i = D.findIndex((d) => slot.dom.includes(d)); if (i < 0) return false; D.splice(i, 1); }
    else if (slot.lang) { if (L.length < slot.lang) return false; L.splice(0, slot.lang); }
    else if (slot.domAny) { if (D.length < slot.domAny) return false; D.splice(0, slot.domAny); }
  }
  return true;
}
function isEligible(pid, L, D, gt) { const r = RULES[pid] || []; return r.some((c) => matchCombo(c, L, D, gt)); }

function Ring({ value, color, max = 950 }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, (value || 0) / max));
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" className="cf-ring">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--border-color)" strokeWidth="5.5" />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5.5"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" className="cf-ring-num">{value ? Math.round(value) : '—'}</text>
    </svg>
  );
}

function ListRow({ title, sub, accent, count, countLabel, seats, top, onOpen }) {
  return (
    <button className="cf-li" onClick={onOpen} style={{ '--rail': accent }}>
      <span className="cf-li-rail" />
      <span className="cf-li-main">
        <span className="cf-li-title">{title}</span>
        <span className="cf-li-tag" style={{ color: accent, background: accent + '14' }}>{sub}</span>
      </span>
      <span className="cf-li-right">
        <span className="cf-stat"><b>{count}</b><i>{countLabel}</i></span>
        <span className="cf-stat"><b>{seats === null ? '-' : nf(seats)}</b><i>seats</i></span>
        <span className="cf-ringwrap"><Ring value={top} color="#2563eb" /><i>highest cutoff</i></span>
      </span>
      <span className="cf-li-go">›</span>
    </button>
  );
}

function Modal({ open, onClose, payload }) {
  const [view, setView] = useState("cutoffs");
  const [score, setScore] = useState("");
  const [eligExpanded, setEligExpanded] = useState(false);
  useEffect(() => { function k(e) { if (e.key === "Escape") onClose(); } if (open) document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [open, onClose]);
  if (!open || !payload) return null;
  const { mode, item, eligibleIds } = payload;
  const numScore = score === "" ? null : Math.max(0, Math.min(1000, Number(score) || 0));
  let title, accent, rows;
  const eligibility = mode === "program" ? (item.eligibility || getEligibilityForProgram(item.name)) : null;
  if (mode === "program") {
    const p = item; accent = STREAMS[p.stream].color; title = "Colleges offering " + p.name;
    const myOffs = offerings.filter(o => o.programId === p.id);
    rows = myOffs.map((o) => ({ key: o.collegeId, name: o.college?.short || o.collegeName, women: o.gender === "Women", cutoffs: CATEGORIES.map((cat) => getCutoff(o, cat)), seats: CATEGORIES.map((cat) => getSeats(o, cat)) }));
  } else {
    const c = item; accent = "#2563eb"; title = "Your courses at " + c.name;
    const myOffs = offerings.filter(o => o.collegeId === c.id);
    rows = myOffs.filter((o) => !eligibleIds || eligibleIds.has(o.programId)).map(o => {
      const p = PROGRAMS.find(px => px.id === o.programId);
      if (!p) return null;
      return { key: p.id, name: p.name, stream: p.stream, cutoffs: CATEGORIES.map((cat) => getCutoff(o, cat)), seats: CATEGORIES.map((cat) => getSeats(o, cat)) };
    }).filter(Boolean);
  }
  rows.sort((a, b) => (b.cutoffs[0] || 0) - (a.cutoffs[0] || 0));

  const colStats = CATEGORIES.map((_, ci) => {
    const vals = rows.map(r => r.cutoffs[ci]).filter(v => v !== null && v !== undefined);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  });

  const seatColStats = CATEGORIES.map((_, ci) => {
    const vals = rows.map(r => r.seats[ci]).filter(v => v !== null && v !== undefined);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  });

  function heatClass(v, ci, isCut) {
    if (v === null || v === undefined) return '';
    const { min, max } = isCut ? colStats[ci] : seatColStats[ci];
    if (max === min) return 'cf-heat-5';
    const pct = (v - min) / (max - min);
    if (pct >= 0.8) return 'cf-heat-5';
    if (pct >= 0.6) return 'cf-heat-4';
    if (pct >= 0.4) return 'cf-heat-3';
    if (pct >= 0.2) return 'cf-heat-2';
    return 'cf-heat-1';
  }

  return (
    <div className="cf-overlay" onClick={onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ "--maccent": accent }}>
        <div className="cf-modal-head"><div className="cf-modal-title">{title}</div><button className="cf-x" onClick={onClose} aria-label="Close">×</button></div>
        {eligibility && (
          <div className="cf-elig-strip">
            <span className="cf-elig-label">📋 Eligibility</span>
            <span className={`cf-elig-text ${eligExpanded ? 'expanded' : ''}`}>{eligibility}</span>
            <button className="cf-elig-toggle" onClick={() => setEligExpanded(e => !e)}>
              {eligExpanded ? 'Less ▲' : 'More ▼'}
            </button>
          </div>
        )}

        <div className="cf-modal-tools">
          <div className="cf-tabs"><span className="cf-tabs-label">View</span>
            <button className={"cf-tab " + (view === "seats" ? "on" : "")} onClick={() => setView("seats")}>Seats</button>
            <button className={"cf-tab " + (view === "cutoffs" ? "on" : "")} onClick={() => setView("cutoffs")}>Cutoffs</button>
          </div>
          {view === "cutoffs" && <input className="cf-scorein" type="number" inputMode="numeric" placeholder="Your CUET score → where you qualify lights up" value={score} onChange={(e) => setScore(e.target.value)} max={1000} min={0} />}
        </div>
        <div className="cf-tablewrap">
          <table className="cf-table">
            <thead><tr><th className="cf-th-name">{mode === "program" ? "College" : "Program"}</th>{CATEGORIES.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => {
                const vals = view === "cutoffs" ? r.cutoffs : r.seats; return (
                  <tr key={r.key}>
                    <td className="cf-td-name">
                      <div className="cf-td-name-inner">
                        <span className="cf-td-name-text">{r.name}</span>
                        {r.women && <span className="cf-badge-w">Women</span>}
                        {r.stream && <span className="cf-badge-s" style={{ color: STREAMS[r.stream].color, background: STREAMS[r.stream].color + "14" }}>{STREAMS[r.stream].label.split(" ")[0]}</span>}
                      </div>
                    </td>
                    {vals.map((v, i) => {
                      const isCut = view === "cutoffs";
                      const q = isCut && numScore !== null && v !== null && numScore >= v;
                      const heat = isCut && !q ? heatClass(v, i, true) : !isCut && v !== null ? heatClass(v, i, false) : '';
                      return (
                        <td key={i} className={"cf-num-cell " + heat + (q ? " cf-q" : "")}>{v === null ? <span className="cf-dash">—</span> : (isCut ? v.toFixed(1) : v)}{q && <i className="cf-tick">✓</i>}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SubjectCombination() {
  const [langs, setLangs] = useState([]);
  const [domains, setDomains] = useState([]);
  const [gt, setGt] = useState(false);
  const [subjQuery, setSubjQuery] = useState("");
  const [shown, setShown] = useState(false);
  const [tab, setTab] = useState("eligible");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [campus, setCampus] = useState("all");
  const [sort, setSort] = useState("seats");

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setQuery("");
    setGroup("all");
    setCampus("all");
  };

  const domainGtPicked = domains.length + (gt ? 1 : 0);
  const totalPicked = langs.length + domainGtPicked;

  const toggleLang = (v) => {
    if (langs.includes(v)) setLangs([]);
    else setLangs([v]);
  };

  const toggleDomain = (v) => {
    if (domains.includes(v)) setDomains(domains.filter((x) => x !== v));
    else {
      if (domainGtPicked >= 4) return alert("You can select a maximum of 4 subjects across Domains and General Test.");
      setDomains([...domains, v]);
    }
  };

  const toggleGt = () => {
    if (gt) setGt(false);
    else {
      if (domainGtPicked >= 4) return alert("You can select a maximum of 4 subjects across Domains and General Test.");
      setGt(true);
    }
  };

  const reset = () => { setLangs([]); setDomains([]); setGt(false); setShown(false); };

  const evaluated = useMemo(() => PROGRAMS.map((p) => ({ p, ok: isEligible(p.id, langs, domains, gt) })), [langs, domains, gt]);
  const eligible = useMemo(() => evaluated.filter((x) => x.ok).map((x) => x.p), [evaluated]);
  const eligibleIds = useMemo(() => new Set(eligible.map((p) => p.id)), [eligible]);
  const openColleges = useMemo(() => {
    return REAL_COLLEGES.map(c => {
      const myOfferings = offerings.filter(o => o.collegeId === c.id);
      const eProgs = myOfferings.map(o => PROGRAMS.find(p => p.id === o.programId)).filter(Boolean).filter(p => eligibleIds.has(p.id));
      return { c, eProgs: Array.from(new Set(eProgs)) };
    }).filter(x => x.eProgs.length > 0);
  }, [eligibleIds]);

  const campusOptions = useMemo(() => {
    const set = new Set(REAL_COLLEGES.map((c) => c.campus));
    return Array.from(set).filter((c) => c !== 'Various').sort();
  }, []);

  const eligShown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = eligible
      .filter((p) => (group === 'all' || p.stream === group) && (!q || p.name.toLowerCase().includes(q)))
      .map((p) => ({
        ...p,
        ...progStats(p)
      }));
    
    list.sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'cutoff') return b.topCutoff - a.topCutoff;
      if (sort === 'colleges') return b.count - a.count;
      return (b.totalSeats || 0) - (a.totalSeats || 0);
    });
    return list;
  }, [eligible, query, group, sort]);

  const collegesShown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = openColleges
      .filter(({ c }) => (campus === 'all' || (campus === 'women' ? c.type === 'Women' : c.campus === campus)) && (!q || c.name.toLowerCase().includes(q)))
      .map(({ c, eProgs }) => {
        const myOffs = offerings.filter(o => o.collegeId === c.id && eProgs.some(p => p.id === o.programId));
        const totalSeats = myOffs.reduce((s, o) => s + (o.seats.total || 0), 0);
        const topCutoff = myOffs.reduce((m, o) => Math.max(m, o.cutoffs.UR || 0), 0);
        return {
          c,
          eProgs,
          count: eProgs.length,
          totalSeats,
          topCutoff
        };
      });

    list.sort((a, b) => {
      if (sort === 'az') return a.c.name.localeCompare(b.c.name);
      if (sort === 'cutoff') return b.topCutoff - a.topCutoff;
      if (sort === 'colleges') return b.count - a.count;
      return (b.totalSeats || 0) - (a.totalSeats || 0);
    });
    return list;
  }, [openColleges, query, campus, sort]);

  return (
    <div className="cp-wrap">
      <style>{CSS}</style>
      <section className="cp-herowrap cp-hero-new">
        <div className="cp-hero-bg" aria-hidden="true">
          <div className="cp-hero-blob cp-hero-blob-1" />
          <div className="cp-hero-blob cp-hero-blob-2" />
          <div className="cp-hero-blob cp-hero-blob-3" />
          <div className="cp-hero-grid" />
        </div>
        <div className="cp-hero-content">
          <span className="cp-herobadge-new">CUET 2026 · Eligibility Engine</span>
          <h1>Subject Combination &amp;<br />Course Explorer</h1>
          <p>Pick the CUET subjects you appeared for. We'll show every program you're eligible for and the colleges open to you.</p>
        </div>
        <div className="cp-hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 260 195" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="140" cy="100" rx="110" ry="90" fill="rgba(255,255,255,0.04)" />
            <rect x="10" y="15" width="175" height="130" rx="14" fill="white" fillOpacity="0.97" />
            <rect x="10" y="15" width="175" height="38" rx="14" fill="#2563eb" />
            <rect x="10" y="39" width="175" height="14" fill="#2563eb" />
            <rect x="24" y="26" width="72" height="7" rx="3.5" fill="white" fillOpacity="0.95" />
            <rect x="24" y="39" width="44" height="4.5" rx="2" fill="white" fillOpacity="0.45" />
            <circle cx="168" cy="36" r="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M168 21 a15 15 0 0 1 13 7.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <text x="168" y="40" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">5</text>
            <line x1="24" y1="66" x2="172" y2="66" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="24" y="74" width="82" height="5.5" rx="2.75" fill="#1e3a8a" fillOpacity="0.14" />
            <rect x="116" y="74" width="20" height="5.5" rx="2.75" fill="#2563eb" fillOpacity="0.28" />
            <rect x="142" y="74" width="20" height="5.5" rx="2.75" fill="#2563eb" fillOpacity="0.18" />
            <rect x="24" y="88" width="68" height="5.5" rx="2.75" fill="#1e3a8a" fillOpacity="0.1" />
            <rect x="116" y="88" width="20" height="5.5" rx="2.75" fill="#7c3aed" fillOpacity="0.28" />
            <rect x="142" y="88" width="20" height="5.5" rx="2.75" fill="#7c3aed" fillOpacity="0.18" />
            <rect x="12" y="100" width="171" height="16" rx="0" fill="#f0fdf4" />
            <rect x="24" y="104" width="76" height="5.5" rx="2.75" fill="#16a34a" fillOpacity="0.35" />
            <rect x="116" y="104" width="20" height="5.5" rx="2.75" fill="#16a34a" fillOpacity="0.65" />
            <rect x="142" y="104" width="20" height="5.5" rx="2.75" fill="#16a34a" fillOpacity="0.45" />
            <text x="168" y="109" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="800">✓</text>
            <rect x="24" y="124" width="58" height="5.5" rx="2.75" fill="#1e3a8a" fillOpacity="0.1" />
            <rect x="116" y="124" width="20" height="5.5" rx="2.75" fill="#2563eb" fillOpacity="0.22" />
            <rect x="142" y="124" width="20" height="5.5" rx="2.75" fill="#2563eb" fillOpacity="0.14" />
            <rect x="30" y="154" width="118" height="22" rx="11" fill="white" fillOpacity="0.95" stroke="#2563eb" strokeWidth="1.5" />
            <text x="70" y="169" fill="#94a3b8" fontSize="7" fontWeight="500">Pick your subjects…</text>
            <rect x="136" y="158" width="5" height="14" rx="1.5" fill="#2563eb" fillOpacity="0.6" />
            <rect x="192" y="22" width="58" height="26" rx="9" fill="white" fillOpacity="0.97" />
            <text x="221" y="33" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="800">14</text>
            <text x="221" y="43" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="600">Top Courses</text>
            <rect x="188" y="58" width="64" height="28" rx="9" fill="white" fillOpacity="0.97" />
            <text x="220" y="70" textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="800">66,333</text>
            <text x="220" y="80" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="600">Total Seats</text>
            <rect x="192" y="96" width="58" height="26" rx="9" fill="white" fillOpacity="0.97" />
            <text x="221" y="107" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="800">100%</text>
            <text x="221" y="116" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="600">Real Data</text>
          </svg>
        </div>
      </section>


      <input className="cp-subjsearch" placeholder="Search for a subject…" value={subjQuery} onChange={(e) => setSubjQuery(e.target.value)} />

      <div className="cp-picker">
        <div className="cp-col">
          <div className="cp-col-head">Languages <small>(List A)</small></div>
          <div className="cp-col-body">{LANGUAGES.filter((l) => l.toLowerCase().includes(subjQuery.toLowerCase())).map((l) => <button key={l} className="cp-pick" onClick={() => toggleLang(l)} style={langs.includes(l) ? { borderColor: "#2563eb", background: "#eff6ff", color: "#2563eb" } : {}}>{langs.includes(l) ? "✓ " : ""}{l}</button>)}</div>
        </div>
        <div className="cp-col cp-col-wide">
          <div className="cp-col-head">Domain Subjects <small>(List B)</small></div>
          <div className="cp-col-body cp-col-grid">{DOMAINS.filter((d) => d.toLowerCase().includes(subjQuery.toLowerCase())).map((d) => <button key={d} className="cp-pick" onClick={() => toggleDomain(d)} style={domains.includes(d) ? { borderColor: "#059669", background: "#ecfdf5", color: "#047857" } : {}}>{domains.includes(d) ? "✓ " : ""}{d}</button>)}</div>
        </div>
        <div className="cp-col">
          <div className="cp-col-head">General Test</div>
          <div className="cp-col-body"><button className="cp-pick" onClick={toggleGt} style={gt ? { borderColor: "#7c3aed", background: "#f5f3ff", color: "#7c3aed" } : {}}>{gt ? "✓ " : ""}General Aptitude Test</button></div>
        </div>
      </div>

      <div className="cp-cta-wrap">
        <button className="cp-cta" disabled={langs.length !== 1} onClick={() => setShown(true)}>
          {langs.length === 0 ? "Select 1 Language to proceed" : `See my eligible programs (${totalPicked}/5 selected)`}
        </button>
        {totalPicked > 0 && <button className="cp-reset" onClick={reset}>Clear all</button>}
      </div>

      {shown && totalPicked > 0 && (
        <div className="cf-results" style={{ marginTop: "2rem" }}>
          <div className="cf-seg" data-on={tab === "eligible" ? "program" : "college"}>
            <button className={tab === "eligible" ? "on" : ""} onClick={() => handleTabChange("eligible")}>Browse by Program</button>
            <button className={tab === "colleges" ? "on" : ""} onClick={() => handleTabChange("colleges")}>Browse by College</button>
            <span className="cf-seg-knob" />
          </div>

          <div className="cf-controls">
            <input
              className="cf-search"
              placeholder={tab === 'eligible' ? 'Search programs…' : 'Search colleges…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="cf-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="seats">Most seats</option>
              <option value="cutoff">Highest cutoff</option>
              <option value="colleges">{tab === 'eligible' ? 'Most colleges' : 'Most programs'}</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          <div className="cf-filters">
            {tab === 'eligible' ? (
              <>
                <button className={'cf-chip ' + (group === 'all' ? 'on' : '')} onClick={() => setGroup('all')}>All</button>
                {Object.entries(STREAMS).map(([k, v]) => (
                  <button
                    key={k}
                    className={'cf-chip ' + (group === k ? 'on' : '')}
                    onClick={() => setGroup(k)}
                    style={group === k ? { borderColor: v.color, color: '#fff', background: v.color } : {}}
                  >
                    {v.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button className={'cf-chip ' + (campus === 'all' ? 'on' : '')} onClick={() => setCampus('all')}>All</button>
                {campusOptions.map((c) => (
                  <button key={c} className={'cf-chip ' + (campus === c ? 'on' : '')} onClick={() => setCampus(c)}>{c} Campus</button>
                ))}
                <button className={'cf-chip ' + (campus === 'women' ? 'on' : '')} onClick={() => setCampus('women')}>Women's</button>
              </>
            )}
          </div>

          <div className="cf-table-badge-row">
            <div className="cf-count">
              Showing {tab === 'eligible' ? `${eligShown.length} programs` : `${collegesShown.length} colleges`}
            </div>
            <SourceBadge date="CSAS 2025" />
          </div>

          <main className="cf-list">
            {tab === 'eligible'
              ? (eligShown.length ? eligShown.map((p) => {
                  return (
                    <ListRow
                      key={p.id}
                      title={p.name}
                      sub={STREAMS[p.stream].label}
                      accent={STREAMS[p.stream].color}
                      count={p.count}
                      countLabel="colleges"
                      seats={p.totalSeats}
                      top={p.topCutoff}
                      onOpen={() => setSelected({ mode: 'program', item: p })}
                    />
                  );
                }) : <div className="cf-empty">No eligible programs match the criteria.</div>)
              : (collegesShown.length ? collegesShown.map((item) => {
                  return (
                    <ListRow
                      key={item.c.id}
                      title={item.c.name}
                      sub={item.c.campus + ' Campus · ' + item.c.type}
                      accent="#2563eb"
                      count={item.count}
                      countLabel="courses"
                      seats={item.totalSeats}
                      top={item.topCutoff}
                      onOpen={() => setSelected({ mode: 'college', item: item.c, eligibleIds })}
                    />
                  );
                }) : <div className="cf-empty">No open colleges match the criteria.</div>)}
          </main>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} payload={selected} />
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
.cp-wrap{--bg:#FFFFFF;--card:#f8fafc;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--mari:#2563eb;--ok:#059669;font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg);max-width:1200px;margin:20px auto 100px;padding:32px 32px 48px;border-radius:24px;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);-webkit-font-smoothing:antialiased}
.cp-wrap *{box-sizing:border-box}
.cp-stat b,.cp-num-cell,.cp-scorein,.cp-ring-num{font-variant-numeric:tabular-nums}
.cp-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.cp-brand{display:flex;align-items:center;gap:11px}
.cp-logo{width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:#fff;display:grid;place-items:center;font-family:'Figtree';font-weight:800;font-size:17px}
.cp-brand-name{font-family:'Figtree';font-weight:800;font-size:17px;line-height:1}.cp-brand-sub{font-size:11.5px;color:var(--muted);margin-top:3px}
.cp-demo{font-size:11px;font-weight:600;color:var(--mari);background:#eff6ff;padding:5px 11px;border-radius:20px;border:1px solid #bfdbfe}
.cp-hero-new { position:relative; background:linear-gradient(125deg,#1e3a8a 0%,#1d4ed8 45%,#2563eb 70%,#3b82f6 100%); border-radius:18px; padding:2.5rem 2rem 2.25rem 2.5rem; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; gap:1.5rem; overflow:hidden; min-height:200px; box-shadow:0 8px 32px rgba(37,99,235,0.3),0 2px 8px rgba(37,99,235,0.2) }
.cp-hero-bg { position:absolute; inset:0; pointer-events:none; z-index:0 }
.cp-hero-blob { position:absolute; border-radius:50%; filter:blur(40px) }
.cp-hero-blob-1 { width:260px; height:260px; background:rgba(99,179,237,0.25); top:-80px; right:160px }
.cp-hero-blob-2 { width:200px; height:200px; background:rgba(167,139,250,0.2); bottom:-60px; right:60px }
.cp-hero-blob-3 { width:140px; height:140px; background:rgba(52,211,153,0.15); top:20px; left:40%; filter:blur(30px) }
.cp-hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px); background-size:32px 32px }
.cp-hero-content { flex:1; min-width:0; position:relative; z-index:1 }
.cp-herobadge-new { display:inline-block; background:rgba(255,255,255,0.18); color:#fff; font-size:11.5px; font-weight:700; padding:4.5px 11px; border-radius:6px; letter-spacing:0.4px; margin-bottom:13px; border:1px solid rgba(255,255,255,0.25); backdrop-filter:blur(4px) }
.cp-hero-new h1 { font-family:'Figtree'; font-size:38px; font-weight:800; letter-spacing:-1px; margin:0 0 10px; color:#ffffff; line-height:1.1; text-shadow:0 1px 4px rgba(0,0,0,0.15) }
.cp-hero-new p { font-size:15px; line-height:1.55; color:rgba(255,255,255,0.8); margin:0; max-width:44ch }
.cp-hero-illustration { flex-shrink:0; width:220px; position:relative; z-index:1; filter:drop-shadow(0 8px 24px rgba(0,0,0,0.2)) }
.cp-hero-illustration svg { width:100%; height:auto; display:block }
@media(max-width:640px){ .cp-hero-new { padding: 1.75rem 1.25rem; min-height:auto; flex-direction: column; } .cp-hero-illustration { display:none } .cp-hero-new h1 { font-size:1.85rem; } }
.cp-banner{background:#ecfdf5;border:1px solid #a7f3d0;color:#047857;font-size:13px;font-weight:600;padding:12px 15px;border-radius:12px;margin-bottom:14px;text-align:center}
.cp-how{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:16px}
.cp-how-head{font-family:'Figtree';font-weight:700;font-size:14px;margin-bottom:10px}
.cp-how ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:7px}
.cp-how li{font-size:13px;color:var(--muted);line-height:1.5}.cp-how b{color:var(--ink)}
.cp-subjsearch{width:100%;border:1px solid var(--line);background:#fff;border-radius:12px;padding:13px 15px;font-size:14px;font-family:inherit;color:var(--ink);margin-bottom:14px}
.cp-subjsearch:focus{outline:2px solid var(--mari);outline-offset:1px;border-color:transparent}.cp-subjsearch::placeholder{color:#94a3b8}
.cp-picker{display:grid;grid-template-columns:1fr 1.6fr 0.9fr;gap:12px;margin-bottom:16px}
.cp-col{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px}
.cp-col-head{font-family:'Figtree';font-weight:700;font-size:14px;margin-bottom:12px}.cp-col-head small{font-weight:500;color:var(--muted);font-size:12px}
.cp-col-body{display:flex;flex-direction:column;gap:7px}
.cp-col-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.cp-pick{border:1px solid var(--line);background:#ffffff;color:#334155;border-radius:9px;padding:9px 11px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.14s;text-align:center;line-height:1.3}
.cp-pick:hover{border-color:#94a3b8;background-color:#f8fafc;color:#0f172a;transform:none;box-shadow:none}
.cp-cta-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:24px}
.cp-cta{border:0;background:var(--mari);color:#fff;font-family:'Figtree';font-weight:700;font-size:15px;padding:14px 28px;border-radius:13px;cursor:pointer;box-shadow:0 6px 16px rgba(37,99,235,.28);transition:.16s}
.cp-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 9px 22px rgba(37,99,235,.34)}
.cp-cta:disabled{background:#e2e8f0;color:#94a3b8;cursor:not-allowed;box-shadow:none}
.cp-reset{border:0;background:none;color:var(--mari);font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit}
.cp-reset:hover{background-color:transparent;color:#1d4ed8;box-shadow:none;transform:none}
.cp-selected-summary{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:20px}
.cp-selected-head{font-family:'Figtree';font-weight:700;font-size:14px;margin-bottom:12px;color:var(--ink)}
.cp-selected-chips{display:flex;flex-wrap:wrap;gap:8px}
.cp-chip-sel{font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px}
.cp-chip-lang{background:#eff6ff;color:#2563eb}
.cp-chip-dom{background:#ecfdf5;color:#059669}
.cp-chip-gt{background:#f5f3ff;color:#7c3aed}
.cp-results{margin-bottom:8px}
.cp-filters3{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10px;margin-bottom:16px}
.cp-field{display:flex;flex-direction:column;gap:5px;min-width:0}
.cp-field label{font-size:10.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--muted)}
.cp-field select{appearance:none;-webkit-appearance:none;border:1px solid var(--line);background:#fff url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 14px center;background-size:14px;border-radius:11px;padding:11px 36px 11px 14px;font-size:13.5px;font-weight:500;font-family:inherit;color:var(--ink);cursor:pointer;width:100%;transition:all .2s ease;box-shadow:0 1px 2px rgba(0,0,0,0.02)}
.cp-field select:hover:not(:disabled){border-color:#94a3b8;box-shadow:0 2px 5px rgba(0,0,0,0.05)}
.cp-field select:focus{outline:none;border-color:var(--mari);box-shadow:0 0 0 3px rgba(37,99,235,0.15)}
.cp-field select:disabled{background-color:#f8fafc;color:#94a3b8;cursor:not-allowed;opacity:0.8}
.cp-chip{border:1px solid var(--line);background:#fff;color:var(--muted);border-radius:20px;padding:7px 13px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s}.cp-chip.on{border-color:var(--mari);color:#fff;background:var(--mari)}
.cp-restabs{display:flex;gap:22px;border-bottom:1px solid var(--line);margin-bottom:16px;overflow-x:auto}
.cp-restabs button{border:0;background:transparent;cursor:pointer;font-family:'Figtree';font-weight:700;font-size:14px;color:var(--muted);padding:0 0 12px;position:relative;white-space:nowrap;transition:color .18s}
.cp-restabs button:hover{background-color:transparent;color:var(--ink);box-shadow:none;transform:none}
.cp-restabs button.on{color:var(--mari)}
.cp-restabs button.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2.5px;background:var(--mari);border-radius:2px}
.cp-reslist{display:flex;flex-direction:column;gap:10px}
.cp-li{position:relative;display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px 14px 15px 19px;cursor:pointer;font-family:inherit;transition:.16s}
.cp-li:hover{border-color:var(--rail);background-color:var(--card);color:var(--ink);box-shadow:0 8px 22px rgba(37,99,235,.10);transform:translateY(-2px)}.cp-li:focus-visible{outline:2px solid var(--rail);outline-offset:2px}
.cp-li-rail{position:absolute;left:0;top:13px;bottom:13px;width:4px;border-radius:4px;background:var(--rail)}
.cp-li-main{flex:1;min-width:0}
.cp-li-title{display:block;font-family:'Figtree';font-weight:700;font-size:16px;color:var(--ink);line-height:1.2}
.cp-li-tag{display:inline-block;margin-top:7px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px}
.cp-li-right{display:flex;align-items:center;gap:16px}
.cp-stat{display:flex;flex-direction:column;align-items:center;text-align:center;white-space:nowrap}
.cp-stat b{font-family:'Figtree';font-weight:800;font-size:16px;color:var(--ink);line-height:1}.cp-stat i{font-style:normal;font-size:10px;color:var(--muted);margin-top:4px}
.cp-ringwrap{display:flex;flex-direction:column;align-items:center;gap:3px}.cp-ringwrap i{font-style:normal;font-size:9.5px;color:var(--muted)}
.cp-ring-num{font-family:'Figtree';font-weight:800;font-size:13px;fill:var(--ink)}
.cp-li-go{font-size:23px;color:#cbd5e1;line-height:1;flex-shrink:0}
.cp-empty{text-align:center;color:var(--muted);font-size:14px;padding:30px 20px;border:1px dashed var(--line);border-radius:14px;background:#fff}
.cp-foot{margin-top:24px;padding-top:16px;border-top:1px solid var(--line)}.cp-foot p{font-size:12px;line-height:1.55;color:var(--muted);margin:0 0 8px}.cp-foot b{color:var(--ink)}.cp-foot-by{font-size:11px;color:#94a3b8}
.cp-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;z-index:9999;animation:f .18s ease}
.cp-modal{background:#fff;width:100%;max-width:700px;max-height:92vh;border-radius:22px 22px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -10px 50px rgba(15,23,42,.3);animation:u .26s cubic-bezier(.2,.8,.2,1);border-top:4px solid var(--maccent)}
@keyframes f{from{opacity:0}to{opacity:1}}@keyframes u{from{transform:translateY(40px)}to{transform:none}}
.cp-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:24px 30px 16px}
.cp-modal-title{font-family:'Figtree';font-weight:800;font-size:19px;line-height:1.2;color:var(--ink)}
.cp-x{border:0;background:#f1f5f9;width:32px;height:32px;border-radius:50%;font-size:20px;color:var(--ink);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;line-height:1}
.cp-x:hover{background-color:#e2e8f0;color:var(--ink);box-shadow:none;transform:none}
.cp-eligbox{margin:0 30px 18px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px 20px}
.cp-eligbox-head{font-family:'Figtree';font-weight:700;font-size:13px;color:#1e40af;margin-bottom:10px}.cp-eligbox-head span{font-weight:500;color:#3b82f6;font-size:11.5px}
.cp-combos{display:flex;flex-direction:column;gap:9px}
.cp-combo{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.cp-combo-name{font-size:11px;font-weight:700;color:var(--mari);background:#dbeafe;padding:3px 9px;border-radius:7px;white-space:nowrap}
.cp-combo-reqs{display:flex;gap:6px;flex-wrap:wrap}
.cp-req{font-size:12px;font-weight:600;color:#1e3a8a;background:#fff;border:1px solid #bfdbfe;padding:3px 9px;border-radius:7px}
.cp-modal-tools{padding:0 30px 16px;display:flex;flex-direction:column;gap:10px}
.cp-tabs{display:flex;align-items:center;gap:8px}.cp-tabs-label{font-size:13px;font-weight:600;color:var(--muted);margin-right:2px}
.cp-tab{border:1px solid var(--line);background:#fff;color:var(--muted);border-radius:9px;padding:7px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s}
.cp-tab:hover{background-color:#f8fafc;color:var(--ink);box-shadow:none;transform:none}
.cp-tab.on{background:var(--maccent);color:#fff;border-color:var(--maccent)}
.cp-tab.on:hover{background-color:var(--maccent);color:#fff}
.cp-scorein{border:1px solid var(--line);background:#f8fafc;border-radius:11px;padding:10px 13px;font-size:13px;font-family:inherit;color:var(--ink)}.cp-scorein:focus{outline:2px solid var(--maccent);outline-offset:1px;border-color:transparent}.cp-scorein::placeholder{color:#94a3b8}
.cp-tablewrap{overflow:auto;flex:1;border-top:1px solid var(--line);-ms-overflow-style:none;scrollbar-width:none}
.cp-tablewrap::-webkit-scrollbar{display:none}
.cp-table{width:100%;min-width:540px;border-collapse:collapse;font-size:13.5px}
.cp-table thead th{position:sticky;top:0;z-index:2;background:#f8fafc;color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.3px;text-align:right;padding:11px 30px 11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.cp-table thead th.cp-th-name{text-align:left;padding-left:30px;left:0;z-index:3}
.cp-table td{padding:11px 30px 11px 14px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap}
.cp-table td:first-child{padding-left:30px}
.cp-td-name{text-align:left;font-weight:600;position:sticky;left:0;z-index:1;background:#fff;display:flex;align-items:center;gap:7px;max-width:240px}.cp-td-name>span:first-child{white-space:normal}
.cp-badge-w{font-size:10px;font-weight:700;color:#be185d;background:#fce7f3;padding:2px 7px;border-radius:20px;white-space:nowrap}
.cp-badge-s{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;white-space:nowrap}
.cp-num-cell{font-weight:600;position:relative}.cp-num-cell.cp-q{outline:2px solid var(--ok);outline-offset:-2px;font-weight:800;border-radius:7px}
.cp-tick{font-style:normal;color:var(--ok);font-size:10px;margin-left:3px;font-weight:800}.cp-dash{color:#cbd5e1}
.cp-legend{display:flex;align-items:center;gap:8px;justify-content:flex-end;padding:9px 30px;font-size:10.5px;color:var(--muted)}
.cp-legend-bar{width:90px;height:7px;border-radius:5px;background:linear-gradient(90deg,hsla(145,72%,45%,.6),hsla(60,72%,45%,.6),hsla(0,72%,45%,.6))}
.cp-modal-foot{padding:13px 30px;font-size:11.5px;color:#1e40af;background:#eff6ff;border-top:1px solid #bfdbfe;line-height:1.5}
@media (min-width:560px){.cp-overlay{align-items:center;padding:24px}.cp-modal{border-radius:22px;border:1px solid var(--line);border-top:4px solid var(--maccent)}}
@media (max-width:720px){.cp-picker{grid-template-columns:1fr}.cp-col-grid{grid-template-columns:1fr 1fr}.cp-filters3{grid-template-columns:1fr}}
@media (max-width:480px){.cp-herowrap h1{font-size:24px}.cp-col-grid{grid-template-columns:1fr}.cp-li-right{gap:11px}.cp-stat i{font-size:9px}}
@media (prefers-reduced-motion:reduce){.cp-cta,.cp-pick,.cp-chip,.cp-tab,.cp-li{transition:none}.cp-overlay,.cp-modal{animation:none}}
`;
