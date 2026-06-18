import React, { useMemo, useState, useEffect } from "react";

import { offerings, CATEGORIES, getCutoff, getSeats } from "../data/cutoffsData";
import { colleges as REAL_COLLEGES } from "../data/colleges";

/* =========================================================================
   CUET Pro — Subject Combination → Course/College Finder · "Dashboard Theme"
   Pick CUET subjects → Eligible Programs / Other Programs / Eligible Colleges.
   ========================================================================= */

const STREAMS = {
  com: { label: "Commerce & Management", color: "#d97706" },
  arts: { label: "Arts & Social Sciences", color: "#7c3aed" },
  lang: { label: "Languages", color: "#e11d48" },
  sci: { label: "Science, Math & Tech", color: "#059669" },
};

const PROGRAMS = [
  { id: "b-com-hons", name: "B.Com. (Hons.)", stream: "com" },
  { id: "b-a-hons-economics", name: "B.A. (Hons.) Economics", stream: "com" },
  { id: "bachelor-of-management-studies-bms", name: "Bachelor of Management Studies (BMS)", stream: "com" },
  { id: "bachelor-of-business-administration-financial-investment-analysis-bba-fia", name: "Bachelor of Business Administration (Financial Investment Analysis) (BBA(FIA))", stream: "com" },
  { id: "b-com", name: "B.Com.", stream: "com" },
  { id: "b-a-hons-psychology", name: "B.A. (Hons.) Psychology", stream: "arts" },
  { id: "b-a-hons-political-science", name: "B.A. (Hons.) Political Science", stream: "arts" },
  { id: "b-a-hons-history", name: "B.A. (Hons.) History", stream: "arts" },
  { id: "b-a-hons-sociology", name: "B.A. (Hons.) Sociology", stream: "arts" },
  { id: "b-a-hons-english", name: "B.A. (Hons.) English", stream: "lang" },
  { id: "b-a-hons-hindi", name: "B.A. (Hons.) Hindi", stream: "lang" },
  { id: "b-sc-hons-computer-science", name: "B.Sc. (Hons.) Computer Science", stream: "sci" },
  { id: "b-sc-hons-mathematics", name: "B.Sc. (Hons.) Mathematics", stream: "sci" },
  { id: "b-sc-hons-statistics", name: "B.Sc. (Hons.) Statistics", stream: "sci" },
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

function Ring({ value, color }) {
  const r = 19, circ = 2 * Math.PI * r, frac = Math.max(0, Math.min(1, (value - 600) / 400));
  return (
    <svg className="cp-ring" width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
      <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} transform="rotate(-90 25 25)" />
      <text x="25" y="28.5" textAnchor="middle" className="cp-ring-num">{Math.round(value)}</text>
    </svg>
  );
}
function Hero() {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="cp-hero-img" viewBox="0 0 420 200" role="img" aria-label="Illustration of subjects opening doors to courses">
      <defs><linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eff6ff" /><stop offset="100%" stopColor="#ffffff" /></linearGradient></defs>
      <rect x="0" y="0" width="420" height="200" rx="18" fill="url(#mSky)" />
      <g transform="translate(210,72)" opacity="0.9">{rays.map((a) => <rect key={a} x="-1.6" y="-46" width="3.2" height="16" rx="2" fill="#93c5fd" transform={`rotate(${a})`} />)}</g>
      <circle cx="210" cy="72" r="26" fill="#3b82f6" />
      <rect x="0" y="150" width="420" height="50" fill="#0f172a" />
      <rect x="60" y="120" width="40" height="30" fill="#1e293b" /><rect x="108" y="108" width="34" height="42" fill="#1e293b" /><rect x="300" y="116" width="40" height="34" fill="#1e293b" /><rect x="346" y="126" width="30" height="24" fill="#1e293b" />
      <rect x="178" y="104" width="64" height="46" fill="#2563eb" /><polygon points="176,104 210,82 244,104" fill="#2563eb" />
      <path d="M196 82 a14 14 0 0 1 28 0 z" fill="#3b82f6" />
      {[184, 196, 208, 220, 232].map((x) => <rect key={x} x={x} y="116" width="5" height="34" fill="#bfdbfe" opacity=".8" />)}
      <g transform="translate(330,52)"><polygon points="0,8 22,0 44,8 22,16" fill="#0f172a" /><path d="M8 12 v10 q14 8 28 0 v-10" fill="#0f172a" opacity=".85" /><line x1="44" y1="8" x2="44" y2="22" stroke="#3b82f6" strokeWidth="2" /><circle cx="44" cy="24" r="3" fill="#3b82f6" /></g>
    </svg>
  );
}

function ListRow({ title, sub, accent, count, countLabel, seats, top, onOpen }) {
  return (
    <button className="cp-li" onClick={onOpen} style={{ "--rail": accent }}>
      <span className="cp-li-rail" />
      <span className="cp-li-main"><span className="cp-li-title">{title}</span><span className="cp-li-tag" style={{ color: accent, background: accent + "16" }}>{sub}</span></span>
      <span className="cp-li-right">
        <span className="cp-stat"><b>{count}</b><i>{countLabel}</i></span>
        <span className="cp-stat"><b>{nf(seats)}</b><i>seats</i></span>
        <span className="cp-ringwrap"><Ring value={top} color={accent} /><i>top cutoff</i></span>
      </span>
      <span className="cp-li-go">›</span>
    </button>
  );
}

function Modal({ open, onClose, payload }) {
  const [view, setView] = useState("cutoffs");
  const [score, setScore] = useState("");
  useEffect(() => { function k(e) { if (e.key === "Escape") onClose(); } if (open) document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [open, onClose]);
  if (!open || !payload) return null;
  const { mode, item, eligibleIds } = payload;
  const numScore = score === "" ? null : Math.max(0, Math.min(1000, Number(score) || 0));
  let title, accent, rows, combos = null;
  if (mode === "program") {
    const p = item; accent = STREAMS[p.stream].color; title = "Colleges offering " + p.name; combos = ELIG[p.id];
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
  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ "--maccent": accent }}>
        <div className="cp-modal-head"><div className="cp-modal-title">{title}</div><button className="cp-x" onClick={onClose} aria-label="Close">×</button></div>
        {combos && (
          <div className="cp-eligbox">
            <div className="cp-eligbox-head">Subject combination required <span>(choose any one)</span></div>
            <div className="cp-combos">{combos.map((cb, ci) => (<div className="cp-combo" key={ci}><span className="cp-combo-name">{cb.name}</span><span className="cp-combo-reqs">{cb.reqs.map((r, ri) => <span className="cp-req" key={ri}>{r}</span>)}</span></div>))}</div>
          </div>
        )}
        <div className="cp-modal-tools">
          <div className="cp-tabs"><span className="cp-tabs-label">View</span>
            <button className={"cp-tab " + (view === "seats" ? "on" : "")} onClick={() => setView("seats")}>Seats</button>
            <button className={"cp-tab " + (view === "cutoffs" ? "on" : "")} onClick={() => setView("cutoffs")}>Cutoffs</button>
          </div>
          {view === "cutoffs" && <input className="cp-scorein" type="number" inputMode="numeric" placeholder="Your CUET score → where you qualify lights up" value={score} onChange={(e) => setScore(e.target.value)} max={1000} min={0} />}
        </div>
        <div className="cp-tablewrap">
          <table className="cp-table">
            <thead><tr><th className="cp-th-name">{mode === "program" ? "College" : "Program"}</th>{CATEGORIES.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => { const vals = view === "cutoffs" ? r.cutoffs : r.seats; return (
                <tr key={r.key}>
                  <td className="cp-td-name"><span>{r.name}</span>{r.women && <span className="cp-badge-w">Women</span>}{r.stream && <span className="cp-badge-s" style={{ color: STREAMS[r.stream].color, background: STREAMS[r.stream].color + "16" }}>{STREAMS[r.stream].label.split(" ")[0]}</span>}</td>
                  {vals.map((v, i) => { const isCut = view === "cutoffs"; const q = isCut && numScore !== null && v !== null && numScore >= v; const bg = isCut && v !== null ? heatBg(v) : undefined; return (
                    <td key={i} className={"cp-num-cell " + (q ? "cp-q" : "")} style={{ background: bg }}>{v === null ? <span className="cp-dash">—</span> : (isCut ? v.toFixed(1) : v)}{q && <i className="cp-tick">✓</i>}</td>
                  ); })}
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
        {view === "cutoffs" && <div className="cp-legend"><span>Low marks</span><span className="cp-legend-bar" /><span>High marks</span></div>}
        <div className="cp-modal-foot">🌼 Sample data for demo — figures and eligibility are illustrative, not official. Confirm on the official DU admission portal.</div>
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
  const [uni, setUni] = useState("du");
  const [streamSel, setStreamSel] = useState("all");
  const [courseSel, setCourseSel] = useState("all");
  const [selected, setSelected] = useState(null);

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

  // if the chosen course is no longer eligible (subjects changed), reset it
  useEffect(() => { if (courseSel !== "all" && !eligibleIds.has(courseSel)) setCourseSel("all"); }, [eligibleIds, courseSel]);

  const course = courseSel !== "all" && eligibleIds.has(courseSel) ? courseSel : "all";
  const passProg = (p) => (course !== "all" ? p.id === course : (streamSel === "all" || p.stream === streamSel));
  const eligShown = eligible.filter(passProg);
  const collegesShown = openColleges
    .map(({ c, eProgs }) => ({ c, eProgs: course !== "all" ? eProgs.filter((p) => p.id === course) : (streamSel === "all" ? eProgs : eProgs.filter((p) => p.stream === streamSel)) }))
    .filter((x) => x.eProgs.length)
    .sort((a, b) => b.eProgs.length - a.eProgs.length);

  return (
    <div className="cp-wrap">
      <style>{CSS}</style>
      <header className="cp-top"><div className="cp-brand"><div className="cp-logo">CP</div><div><div className="cp-brand-name">CUET Pro</div><div className="cp-brand-sub">Delhi University Admissions</div></div></div><span className="cp-demo">Sample data</span></header>
      <section className="cp-herowrap"><div className="cp-herofig"><Hero /><span className="cp-herobadge">Subjects → Courses · CUET 2026</span></div><h1>Subject Combination → Course / College</h1><p>Pick the CUET subjects you appeared for. We'll show every program you're eligible for and the colleges open to you.</p></section>

      <div className="cp-banner">ℹ️ For DU, your CUET subjects must also be present in your Class 12 marksheet.</div>

      <div className="cp-how"><div className="cp-how-head">How it works</div><ol><li>Pick your CUET subjects below, then tap <b>See my eligible programs</b>.</li><li>Explore the programs you're eligible for and the colleges open to you.</li><li>Tap any program or college to see its seats, cutoffs and required subject combinations.</li></ol></div>

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

      {totalPicked > 0 && (
        <div className="cp-selected-summary">
          <div className="cp-selected-head">Your Selected Subjects</div>
          <div className="cp-selected-chips">
            {langs.map(l => <span key={l} className="cp-chip-sel cp-chip-lang">{l}</span>)}
            {domains.map(d => <span key={d} className="cp-chip-sel cp-chip-dom">{d}</span>)}
            {gt && <span className="cp-chip-sel cp-chip-gt">General Aptitude Test</span>}
          </div>
        </div>
      )}

      {shown && totalPicked > 0 && (
        <div className="cp-results">
          <div className="cp-filters3">
            <div className="cp-field"><label>University</label><select value={uni} onChange={(e) => setUni(e.target.value)}><option value="du">University of Delhi</option></select></div>
            <div className="cp-field"><label>Stream</label><select value={streamSel} onChange={(e) => setStreamSel(e.target.value)} disabled={course !== "all"}><option value="all">All streams</option>{Object.entries(STREAMS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <div className="cp-field"><label>Course</label><select value={courseSel} onChange={(e) => setCourseSel(e.target.value)}><option value="all">All eligible courses</option>{eligible.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <div className="cp-restabs">
            <button className={tab === "eligible" ? "on" : ""} onClick={() => setTab("eligible")}>Eligible Programs ({eligShown.length})</button>
            <button className={tab === "colleges" ? "on" : ""} onClick={() => setTab("colleges")}>Eligible Colleges ({collegesShown.length})</button>
          </div>
          <div className="cp-reslist">
            {tab === "eligible" && (eligShown.length ? eligShown.map((p) => { const st = progStats(p); return <ListRow key={p.id} title={p.name} sub={STREAMS[p.stream].label} accent={STREAMS[p.stream].color} count={st.count} countLabel="colleges" seats={st.totalSeats} top={st.topCutoff} onOpen={() => setSelected({ mode: "program", item: p })} />; }) : <div className="cp-empty">No eligible programs for this filter.</div>)}
            {tab === "colleges" && (collegesShown.length ? collegesShown.map(({ c, eProgs }) => { 
              const myOffs = offerings.filter(o => o.collegeId === c.id && eProgs.some(p => p.id === o.programId));
              const seats = myOffs.reduce((s, o) => s + (o.seats.total || 0), 0); 
              const top = myOffs.reduce((m, o) => Math.max(m, o.cutoffs.UR || 0), 0); 
              return <ListRow key={c.id} title={c.name} sub={c.campus + " Campus · " + c.type} accent="#2563eb" count={eProgs.length} countLabel="courses" seats={seats} top={top} onOpen={() => setSelected({ mode: "college", item: c, eligibleIds })} />; 
            }) : <div className="cp-empty">No open colleges for this filter.</div>)}
          </div>
        </div>
      )}

      <footer className="cp-foot"><p><b>Illustrative demo only.</b> Eligibility here is a simplified check of CUET subject combinations and figures are sample data — not official. Always confirm on the official DU admission portal before applying.</p><p className="cp-foot-by">Built for CUET Pro · {new Date().getFullYear()}</p></footer>
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
.cp-herowrap{margin-bottom:16px}
.cp-herofig{position:relative;margin-bottom:14px}
.cp-hero-img{width:100%;height:auto;display:block;border-radius:18px;box-shadow:0 6px 22px rgba(37,99,235,.14)}
.cp-herobadge{position:absolute;left:14px;bottom:14px;background:rgba(15,23,42,.86);color:#fff;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px}
.cp-herowrap h1{font-family:'Figtree';font-weight:800;font-size:28px;line-height:1.06;letter-spacing:-.5px;margin:0 0 8px}
.cp-herowrap p{font-size:14px;line-height:1.5;color:var(--muted);margin:0;max-width:58ch}
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
.cp-tablewrap{overflow:auto;flex:1;border-top:1px solid var(--line)}
.cp-table{width:100%;min-width:540px;border-collapse:collapse;font-size:13.5px}
.cp-table thead th{position:sticky;top:0;background:#f8fafc;color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.3px;text-align:right;padding:11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.cp-table thead th.cp-th-name{text-align:left}
.cp-table td{padding:11px 14px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap}
.cp-table thead th{position:sticky;top:0;background:#f8fafc;color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.3px;text-align:right;padding:11px 30px 11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.cp-table thead th.cp-th-name{text-align:left;padding-left:30px}
.cp-table td{padding:11px 30px 11px 14px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap}
.cp-table td:first-child{padding-left:30px}
.cp-td-name{text-align:left;font-weight:600;position:sticky;left:0;background:#fff;display:flex;align-items:center;gap:7px;max-width:240px}.cp-td-name>span:first-child{white-space:normal}
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
