import React, { useMemo, useState, useEffect } from "react";

/* =========================================================================
   CUET Pro — Subject Combination → Course/College Finder · "Marigold"
   Pick CUET subjects → Eligible Programs / Other Programs / Eligible Colleges.
   Rows match the cutoff matrix; combinations + cutoffs/seats live in the popup.
   Sample data — always verify on the official DU CSAS portal.
   ========================================================================= */

const STREAMS = {
  com: { label: "Commerce & Management", color: "#E8850C" },
  arts: { label: "Arts & Social Sciences", color: "#4338CA" },
  lang: { label: "Languages", color: "#B45309" },
  sci: { label: "Science, Math & Tech", color: "#0E7490" },
};
const PROGRAMS = [
  { id: "bcomh", name: "B.Com (Hons)", stream: "com", comp: 0.965, base: 110 },
  { id: "eco", name: "B.A. (Hons) Economics", stream: "com", comp: 0.958, base: 55 },
  { id: "bms", name: "Bachelor of Management Studies (BMS)", stream: "com", comp: 0.945, base: 50 },
  { id: "bbafia", name: "BBA (Financial Investment Analysis)", stream: "com", comp: 0.92, base: 46 },
  { id: "bcomp", name: "B.Com (Programme)", stream: "com", comp: 0.9, base: 150 },
  { id: "psy", name: "B.A. (Hons) Psychology", stream: "arts", comp: 0.92, base: 30 },
  { id: "pol", name: "B.A. (Hons) Political Science", stream: "arts", comp: 0.915, base: 50 },
  { id: "hist", name: "B.A. (Hons) History", stream: "arts", comp: 0.9, base: 46 },
  { id: "socio", name: "B.A. (Hons) Sociology", stream: "arts", comp: 0.885, base: 40 },
  { id: "bap", name: "B.A. (Programme)", stream: "arts", comp: 0.82, base: 120 },
  { id: "eng", name: "B.A. (Hons) English", stream: "lang", comp: 0.925, base: 46 },
  { id: "hindi", name: "B.A. (Hons) Hindi", stream: "lang", comp: 0.76, base: 80 },
  { id: "csc", name: "B.Sc (Hons) Computer Science", stream: "sci", comp: 0.925, base: 50 },
  { id: "math", name: "B.Sc (Hons) Mathematics", stream: "sci", comp: 0.88, base: 42 },
  { id: "stat", name: "B.Sc (Hons) Statistics", stream: "sci", comp: 0.86, base: 30 },
];
const COLLEGES = [
  { id: "srcc", name: "Shri Ram College of Commerce", short: "SRCC", rep: 1.0, size: 1.25, campus: "North", type: "Co-ed", offers: ["bcomh", "eco", "bbafia"] },
  { id: "hindu", name: "Hindu College", rep: 0.97, size: 1.1, campus: "North", type: "Co-ed", offers: ["bcomh", "eco", "eng", "pol", "hist", "socio", "math", "stat", "csc", "psy", "bap", "hindi"] },
  { id: "hansraj", name: "Hansraj College", rep: 0.95, size: 1.1, campus: "North", type: "Co-ed", offers: ["bcomh", "bcomp", "eco", "eng", "hist", "math", "stat", "csc", "bap", "hindi"] },
  { id: "lsr", name: "Lady Shri Ram College for Women", short: "LSR", rep: 0.96, size: 1.0, campus: "South", type: "Women", offers: ["bcomh", "eco", "bms", "eng", "pol", "hist", "socio", "psy", "math", "stat", "bap"] },
  { id: "miranda", name: "Miranda House", rep: 0.95, size: 1.0, campus: "North", type: "Women", offers: ["bcomh", "eco", "eng", "pol", "hist", "socio", "math", "stat", "csc", "psy", "bap", "hindi"] },
  { id: "kmc", name: "Kirori Mal College", short: "KMC", rep: 0.9, size: 1.12, campus: "North", type: "Co-ed", offers: ["bcomh", "bcomp", "eco", "eng", "pol", "hist", "socio", "math", "stat", "csc", "bap", "hindi"] },
  { id: "ramjas", name: "Ramjas College", rep: 0.89, size: 1.05, campus: "North", type: "Co-ed", offers: ["bcomh", "bcomp", "eco", "eng", "pol", "hist", "math", "stat", "csc", "bap", "hindi"] },
  { id: "venky", name: "Sri Venkateswara College", short: "Venky", rep: 0.9, size: 1.05, campus: "South", type: "Co-ed", offers: ["bcomh", "bcomp", "eco", "bms", "eng", "pol", "math", "stat", "csc", "psy", "bap"] },
  { id: "gargi", name: "Gargi College", rep: 0.86, size: 1.0, campus: "South", type: "Women", offers: ["bcomh", "bcomp", "eco", "bms", "eng", "pol", "hist", "socio", "psy", "bap", "hindi"] },
  { id: "drc", name: "Daulat Ram College", short: "DRC", rep: 0.84, size: 0.95, campus: "North", type: "Women", offers: ["bcomh", "bcomp", "eco", "eng", "hist", "psy", "bap", "hindi"] },
  { id: "knc", name: "Kamala Nehru College", short: "KNC", rep: 0.85, size: 0.95, campus: "South", type: "Women", offers: ["bcomh", "bcomp", "eco", "bms", "bbafia", "eng", "pol", "socio", "psy", "math", "bap", "hindi"] },
  { id: "dsc", name: "Dyal Singh College", rep: 0.8, size: 1.0, campus: "South", type: "Co-ed", offers: ["bcomh", "bcomp", "eco", "eng", "pol", "hist", "math", "bap", "hindi"] },
];
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
  bcomh: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 1 }, { dom: [ACCT] }, { domAny: 2 }]],
  eco: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }]],
  bms: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 1 }, { gt: true }]],
  bbafia: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 1 }, { gt: true }]],
  bcomp: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 1 }, { domAny: 1 }, { gt: true }]],
  psy: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  pol: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  hist: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  socio: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }]],
  bap: [[{ lang: 1 }, { domAny: 3 }], [{ lang: 2 }, { domAny: 2 }], [{ lang: 1 }, { domAny: 1 }, { gt: true }]],
  eng: [[{ slang: "English" }, { domAny: 3 }], [{ slang: "English" }, { lang: 1 }, { domAny: 2 }]],
  hindi: [[{ slang: "Hindi" }, { domAny: 3 }], [{ slang: "Hindi" }, { lang: 1 }, { domAny: 2 }]],
  csc: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
  math: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
  stat: [[{ lang: 1 }, { dom: [MATHS] }, { domAny: 2 }], [{ lang: 2 }, { dom: [MATHS] }, { domAny: 1 }]],
};
const ELIG = {
  bcomh: [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["1 Language", "Accountancy / Book-Keeping", "+ 2 Domain"] }],
  eco: [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }],
  bms: [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "1 Domain", "General Test"] }],
  bbafia: [{ name: "Required", reqs: ["1 Language", "Maths / Applied Maths", "1 Domain", "General Test"] }],
  bcomp: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["1 Language", "1 Domain", "General Test"] }],
  psy: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  pol: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  hist: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  socio: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }],
  bap: [{ name: "Combination I", reqs: ["1 Language", "3 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "2 Domain"] }, { name: "Combination III", reqs: ["1 Language", "1 Domain", "General Test"] }],
  eng: [{ name: "Combination I", reqs: ["English (Language)", "3 Domain"] }, { name: "Combination II", reqs: ["English (Language)", "1 Language", "2 Domain"] }],
  hindi: [{ name: "Combination I", reqs: ["Hindi (Language)", "3 Domain"] }, { name: "Combination II", reqs: ["Hindi (Language)", "1 Language", "2 Domain"] }],
  csc: [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
  math: [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
  stat: [{ name: "Combination I", reqs: ["1 Language", "Maths / Applied Maths", "+ 2 Domain"] }, { name: "Combination II", reqs: ["2 Languages", "Maths / Applied Maths", "1 Domain"] }],
};

function seed(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; }
function nf(n) { return n.toLocaleString("en-IN"); }
function urCutoff(c, p) { const j = seed(c.id + p.id) * 14; return Math.round(Math.min(966, p.comp * 1000 - (1 - c.rep) * 62 - j) * 10) / 10; }
function progTotalSeats(c, p) { return Math.max(8, Math.round(p.base * c.size)); }
function pwbdExists(c, p) { return seed(c.id + p.id + "pwbd") > 0.22; }
function catCutoff(c, p, cat) { if (cat.id === "PwBD" && !pwbdExists(c, p)) return null; const jit = (seed(c.id + p.id + cat.id + "j") - 0.5) * 70; return Math.max(290, Math.round((urCutoff(c, p) - cat.delta + jit) * 10) / 10); }
function catSeats(c, p, cat) { if (cat.id === "PwBD" && !pwbdExists(c, p)) return null; return Math.max(1, Math.round(progTotalSeats(c, p) * cat.share)); }
function heatBg(v) { const t = Math.max(0, Math.min(1, (v - 650) / 300)); const hue = 145 * (1 - t); return `hsla(${hue},72%,45%,0.20)`; }
function progCols(p) { return COLLEGES.filter((c) => c.offers.includes(p.id)); }
function progStats(p) { const cols = progCols(p); return { count: cols.length, totalSeats: cols.reduce((s, c) => s + progTotalSeats(c, p), 0), topCutoff: cols.reduce((m, c) => Math.max(m, urCutoff(c, p)), 0) }; }

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
      <circle cx="25" cy="25" r={r} fill="none" stroke="#F1E6D2" strokeWidth="4.5" />
      <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} transform="rotate(-90 25 25)" />
      <text x="25" y="28.5" textAnchor="middle" className="cp-ring-num">{Math.round(value)}</text>
    </svg>
  );
}
function Hero() {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="cp-hero-img" viewBox="0 0 420 200" role="img" aria-label="Illustration of subjects opening doors to courses">
      <defs><linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE7C2" /><stop offset="100%" stopColor="#FFF7EA" /></linearGradient></defs>
      <rect x="0" y="0" width="420" height="200" rx="18" fill="url(#mSky)" />
      <g transform="translate(210,72)" opacity="0.9">{rays.map((a) => <rect key={a} x="-1.6" y="-46" width="3.2" height="16" rx="2" fill="#F6B23B" transform={`rotate(${a})`} />)}</g>
      <circle cx="210" cy="72" r="26" fill="#F59E0B" />
      <rect x="0" y="150" width="420" height="50" fill="#3730A3" />
      <rect x="60" y="120" width="40" height="30" fill="#312E81" /><rect x="108" y="108" width="34" height="42" fill="#312E81" /><rect x="300" y="116" width="40" height="34" fill="#312E81" /><rect x="346" y="126" width="30" height="24" fill="#312E81" />
      <rect x="178" y="104" width="64" height="46" fill="#4338CA" /><polygon points="176,104 210,82 244,104" fill="#4338CA" />
      <path d="M196 82 a14 14 0 0 1 28 0 z" fill="#F59E0B" />
      {[184, 196, 208, 220, 232].map((x) => <rect key={x} x={x} y="116" width="5" height="34" fill="#A5B4FC" opacity=".8" />)}
      <g transform="translate(330,52)"><polygon points="0,8 22,0 44,8 22,16" fill="#1E1B4B" /><path d="M8 12 v10 q14 8 28 0 v-10" fill="#1E1B4B" opacity=".85" /><line x1="44" y1="8" x2="44" y2="22" stroke="#F59E0B" strokeWidth="2" /><circle cx="44" cy="24" r="3" fill="#F59E0B" /></g>
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
    rows = progCols(p).map((c) => ({ key: c.id, name: c.short || c.name, women: c.type === "Women", cutoffs: RES_CATS.map((cat) => catCutoff(c, p, cat)), seats: RES_CATS.map((cat) => catSeats(c, p, cat)) }));
  } else {
    const c = item; accent = "#E8850C"; title = "Your courses at " + c.name;
    rows = c.offers.filter((id) => !eligibleIds || eligibleIds.has(id)).map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean).map((p) => ({ key: p.id, name: p.name, stream: p.stream, cutoffs: RES_CATS.map((cat) => catCutoff(c, p, cat)), seats: RES_CATS.map((cat) => catSeats(c, p, cat)) }));
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
            <thead><tr><th className="cp-th-name">{mode === "program" ? "College" : "Program"}</th>{RES_CATS.map((c) => <th key={c.id}>{c.label}</th>)}</tr></thead>
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

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setLangs([]); setDomains([]); setGt(false); setShown(false); };
  const totalPicked = langs.length + domains.length + (gt ? 1 : 0);

  const evaluated = useMemo(() => PROGRAMS.map((p) => ({ p, ok: isEligible(p.id, langs, domains, gt) })), [langs, domains, gt]);
  const eligible = useMemo(() => evaluated.filter((x) => x.ok).map((x) => x.p), [evaluated]);
  const eligibleIds = useMemo(() => new Set(eligible.map((p) => p.id)), [eligible]);
  const openColleges = useMemo(() => COLLEGES.map((c) => ({ c, eProgs: c.offers.filter((id) => eligibleIds.has(id)).map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean) })).filter((x) => x.eProgs.length), [eligibleIds]);

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
          <div className="cp-col-body">{LANGUAGES.filter((l) => l.toLowerCase().includes(subjQuery.toLowerCase())).map((l) => <button key={l} className="cp-pick" onClick={() => toggle(langs, setLangs, l)} style={langs.includes(l) ? { borderColor: "#B45309", background: "#FBEAD7", color: "#B45309" } : {}}>{langs.includes(l) ? "✓ " : ""}{l}</button>)}</div>
        </div>
        <div className="cp-col cp-col-wide">
          <div className="cp-col-head">Domain Subjects <small>(List B)</small></div>
          <div className="cp-col-body cp-col-grid">{DOMAINS.filter((d) => d.toLowerCase().includes(subjQuery.toLowerCase())).map((d) => <button key={d} className="cp-pick" onClick={() => toggle(domains, setDomains, d)} style={domains.includes(d) ? { borderColor: "#E8850C", background: "#FCEAD2", color: "#9A5B0A" } : {}}>{domains.includes(d) ? "✓ " : ""}{d}</button>)}</div>
        </div>
        <div className="cp-col">
          <div className="cp-col-head">General Test</div>
          <div className="cp-col-body"><button className="cp-pick" onClick={() => setGt(!gt)} style={gt ? { borderColor: "#4338CA", background: "#E8E7FB", color: "#4338CA" } : {}}>{gt ? "✓ " : ""}General Aptitude Test</button></div>
        </div>
      </div>

      <div className="cp-cta-wrap">
        <button className="cp-cta" disabled={totalPicked === 0} onClick={() => setShown(true)}>See my eligible programs{totalPicked ? ` (${totalPicked} selected)` : ""}</button>
        {totalPicked > 0 && <button className="cp-reset" onClick={reset}>Clear all</button>}
      </div>

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
            {tab === "colleges" && (collegesShown.length ? collegesShown.map(({ c, eProgs }) => { const seats = eProgs.reduce((s, p) => s + progTotalSeats(c, p), 0); const top = eProgs.reduce((m, p) => Math.max(m, urCutoff(c, p)), 0); return <ListRow key={c.id} title={c.name} sub={c.campus + " Campus · " + c.type} accent="#E8850C" count={eProgs.length} countLabel="courses" seats={seats} top={top} onOpen={() => setSelected({ mode: "college", item: c, eligibleIds })} />; }) : <div className="cp-empty">No open colleges for this filter.</div>)}
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
.cp-wrap{--bg:#FFFBF3;--card:#FFFFFF;--ink:#2A2340;--muted:#7A7290;--line:#F0E6D6;--mari:#E8850C;--ok:#1E9E6A;font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg);max-width:1200px;margin:20px auto 100px;padding:32px 32px 48px;border-radius:24px;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);-webkit-font-smoothing:antialiased}
.cp-wrap *{box-sizing:border-box}
.cp-stat b,.cp-num-cell,.cp-scorein,.cp-ring-num{font-variant-numeric:tabular-nums}
.cp-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.cp-brand{display:flex;align-items:center;gap:11px}
.cp-logo{width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#F59E0B,#4338CA);color:#fff;display:grid;place-items:center;font-family:'Figtree';font-weight:800;font-size:17px}
.cp-brand-name{font-family:'Figtree';font-weight:800;font-size:17px;line-height:1}.cp-brand-sub{font-size:11.5px;color:var(--muted);margin-top:3px}
.cp-demo{font-size:11px;font-weight:600;color:var(--mari);background:#FCEFD9;padding:5px 11px;border-radius:20px;border:1px solid #F6DDB4}
.cp-herowrap{margin-bottom:16px}
.cp-herofig{position:relative;margin-bottom:14px}
.cp-hero-img{width:100%;height:auto;display:block;border-radius:18px;box-shadow:0 6px 22px rgba(232,133,12,.14)}
.cp-herobadge{position:absolute;left:14px;bottom:14px;background:rgba(42,35,64,.86);color:#fff;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px}
.cp-herowrap h1{font-family:'Figtree';font-weight:800;font-size:28px;line-height:1.06;letter-spacing:-.5px;margin:0 0 8px}
.cp-herowrap p{font-size:14px;line-height:1.5;color:var(--muted);margin:0;max-width:58ch}
.cp-banner{background:#EAF7EE;border:1px solid #C9E9D3;color:#1E7A45;font-size:13px;font-weight:600;padding:12px 15px;border-radius:12px;margin-bottom:14px;text-align:center}
.cp-how{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:16px}
.cp-how-head{font-family:'Figtree';font-weight:700;font-size:14px;margin-bottom:10px}
.cp-how ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:7px}
.cp-how li{font-size:13px;color:var(--muted);line-height:1.5}.cp-how b{color:var(--ink)}
.cp-subjsearch{width:100%;border:1px solid var(--line);background:#fff;border-radius:12px;padding:13px 15px;font-size:14px;font-family:inherit;color:var(--ink);margin-bottom:14px}
.cp-subjsearch:focus{outline:2px solid var(--mari);outline-offset:1px;border-color:transparent}.cp-subjsearch::placeholder{color:#aaa297}
.cp-picker{display:grid;grid-template-columns:1fr 1.6fr 0.9fr;gap:12px;margin-bottom:16px}
.cp-col{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px}
.cp-col-head{font-family:'Figtree';font-weight:700;font-size:14px;margin-bottom:12px}.cp-col-head small{font-weight:500;color:var(--muted);font-size:12px}
.cp-col-body{display:flex;flex-direction:column;gap:7px}
.cp-col-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.cp-pick{border:1px solid var(--line);background:#FAF7F0;color:#4a4458;border-radius:9px;padding:9px 11px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.14s;text-align:center;line-height:1.3}
.cp-pick:hover{border-color:#E8C99A}
.cp-cta-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:24px}
.cp-cta{border:0;background:var(--mari);color:#fff;font-family:'Figtree';font-weight:700;font-size:15px;padding:14px 28px;border-radius:13px;cursor:pointer;box-shadow:0 6px 16px rgba(232,133,12,.28);transition:.16s}
.cp-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 9px 22px rgba(232,133,12,.34)}
.cp-cta:disabled{background:#E7DDCB;color:#aaa297;cursor:not-allowed;box-shadow:none}
.cp-reset{border:0;background:none;color:var(--mari);font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit}
.cp-results{margin-bottom:8px}
.cp-filters3{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10px;margin-bottom:16px}
.cp-field{display:flex;flex-direction:column;gap:5px;min-width:0}
.cp-field label{font-size:10.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--muted)}
.cp-field select{border:1px solid var(--line);background:#fff;border-radius:11px;padding:11px 12px;font-size:13px;font-family:inherit;color:var(--ink);cursor:pointer;width:100%}
.cp-field select:focus{outline:2px solid var(--mari);outline-offset:1px;border-color:transparent}
.cp-field select:disabled{background:#F4F0E8;color:#aaa297;cursor:not-allowed}
.cp-chip{border:1px solid var(--line);background:#fff;color:var(--muted);border-radius:20px;padding:7px 13px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s}.cp-chip.on{border-color:var(--mari);color:#fff;background:var(--mari)}
.cp-restabs{display:flex;gap:22px;border-bottom:1px solid var(--line);margin-bottom:16px;overflow-x:auto}
.cp-restabs button{border:0;background:transparent;cursor:pointer;font-family:'Figtree';font-weight:700;font-size:14px;color:var(--muted);padding:0 0 12px;position:relative;white-space:nowrap;transition:color .18s}
.cp-restabs button.on{color:var(--mari)}
.cp-restabs button.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2.5px;background:var(--mari);border-radius:2px}
.cp-reslist{display:flex;flex-direction:column;gap:10px}
.cp-li{position:relative;display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:15px 14px 15px 19px;cursor:pointer;font-family:inherit;transition:.16s}
.cp-li:hover{border-color:var(--rail);box-shadow:0 8px 22px rgba(232,133,12,.10);transform:translateY(-2px)}.cp-li:focus-visible{outline:2px solid var(--rail);outline-offset:2px}
.cp-li-rail{position:absolute;left:0;top:13px;bottom:13px;width:4px;border-radius:4px;background:var(--rail)}
.cp-li-main{flex:1;min-width:0}
.cp-li-title{display:block;font-family:'Figtree';font-weight:700;font-size:16px;color:var(--ink);line-height:1.2}
.cp-li-tag{display:inline-block;margin-top:7px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px}
.cp-li-right{display:flex;align-items:center;gap:16px}
.cp-stat{display:flex;flex-direction:column;align-items:center;text-align:center;white-space:nowrap}
.cp-stat b{font-family:'Figtree';font-weight:800;font-size:16px;color:var(--ink);line-height:1}.cp-stat i{font-style:normal;font-size:10px;color:var(--muted);margin-top:4px}
.cp-ringwrap{display:flex;flex-direction:column;align-items:center;gap:3px}.cp-ringwrap i{font-style:normal;font-size:9.5px;color:var(--muted)}
.cp-ring-num{font-family:'Figtree';font-weight:800;font-size:13px;fill:var(--ink)}
.cp-li-go{font-size:23px;color:#cfc6b6;line-height:1;flex-shrink:0}
.cp-empty{text-align:center;color:var(--muted);font-size:14px;padding:30px 20px;border:1px dashed var(--line);border-radius:14px;background:#fff}
.cp-foot{margin-top:24px;padding-top:16px;border-top:1px solid var(--line)}.cp-foot p{font-size:12px;line-height:1.55;color:var(--muted);margin:0 0 8px}.cp-foot b{color:var(--ink)}.cp-foot-by{font-size:11px;color:#aaa297}
.cp-overlay{position:fixed;inset:0;background:rgba(42,35,64,.5);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;z-index:50;animation:f .18s ease}
.cp-modal{background:#fff;width:100%;max-width:700px;max-height:92vh;border-radius:22px 22px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -10px 50px rgba(60,40,10,.3);animation:u .26s cubic-bezier(.2,.8,.2,1);border-top:4px solid var(--maccent)}
@keyframes f{from{opacity:0}to{opacity:1}}@keyframes u{from{transform:translateY(40px)}to{transform:none}}
.cp-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px 12px}
.cp-modal-title{font-family:'Figtree';font-weight:800;font-size:19px;line-height:1.2;color:var(--ink)}
.cp-x{border:0;background:#F4ECDD;width:32px;height:32px;border-radius:50%;font-size:20px;color:var(--ink);cursor:pointer;flex-shrink:0}
.cp-eligbox{margin:0 20px 14px;background:#FFF7EA;border:1px solid #F6E3C4;border-radius:14px;padding:13px 15px}
.cp-eligbox-head{font-family:'Figtree';font-weight:700;font-size:13px;color:#9A5B0A;margin-bottom:10px}.cp-eligbox-head span{font-weight:500;color:#B98A4A;font-size:11.5px}
.cp-combos{display:flex;flex-direction:column;gap:9px}
.cp-combo{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.cp-combo-name{font-size:11px;font-weight:700;color:var(--mari);background:#FCEAD2;padding:3px 9px;border-radius:7px;white-space:nowrap}
.cp-combo-reqs{display:flex;gap:6px;flex-wrap:wrap}
.cp-req{font-size:12px;font-weight:600;color:#5C4B2C;background:#fff;border:1px solid #EAD9BB;padding:3px 9px;border-radius:7px}
.cp-modal-tools{padding:0 20px 14px;display:flex;flex-direction:column;gap:10px}
.cp-tabs{display:flex;align-items:center;gap:8px}.cp-tabs-label{font-size:13px;font-weight:600;color:var(--muted);margin-right:2px}
.cp-tab{border:1px solid var(--line);background:#fff;color:var(--muted);border-radius:9px;padding:7px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s}.cp-tab.on{background:var(--maccent);color:#fff;border-color:var(--maccent)}
.cp-scorein{border:1px solid var(--line);background:#FFFCF6;border-radius:11px;padding:10px 13px;font-size:13px;font-family:inherit;color:var(--ink)}.cp-scorein:focus{outline:2px solid var(--maccent);outline-offset:1px;border-color:transparent}.cp-scorein::placeholder{color:#aaa297}
.cp-tablewrap{overflow:auto;flex:1;border-top:1px solid var(--line)}
.cp-table{width:100%;min-width:540px;border-collapse:collapse;font-size:13.5px}
.cp-table thead th{position:sticky;top:0;background:#FBF4E8;color:var(--muted);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.3px;text-align:right;padding:11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.cp-table thead th.cp-th-name{text-align:left}
.cp-table td{padding:11px 14px;border-bottom:1px solid #F4ECDD;text-align:right;white-space:nowrap}
.cp-td-name{text-align:left;font-weight:600;position:sticky;left:0;background:#fff;display:flex;align-items:center;gap:7px;max-width:240px}.cp-td-name>span:first-child{white-space:normal}
.cp-badge-w{font-size:10px;font-weight:700;color:#B83280;background:#FCE7F3;padding:2px 7px;border-radius:20px;white-space:nowrap}
.cp-badge-s{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;white-space:nowrap}
.cp-num-cell{font-weight:600;position:relative}.cp-num-cell.cp-q{outline:2px solid var(--ok);outline-offset:-2px;font-weight:800;border-radius:7px}
.cp-tick{font-style:normal;color:var(--ok);font-size:10px;margin-left:3px;font-weight:800}.cp-dash{color:#cdc4b3}
.cp-legend{display:flex;align-items:center;gap:8px;justify-content:flex-end;padding:9px 20px;font-size:10.5px;color:var(--muted)}
.cp-legend-bar{width:90px;height:7px;border-radius:5px;background:linear-gradient(90deg,hsla(145,72%,45%,.6),hsla(60,72%,45%,.6),hsla(0,72%,45%,.6))}
.cp-modal-foot{padding:13px 20px;font-size:11.5px;color:#9a5b0a;background:#FFF7EA;border-top:1px solid #F6E3C4;line-height:1.5}
@media (min-width:560px){.cp-overlay{align-items:center;padding:24px}.cp-modal{border-radius:22px;border:1px solid var(--line);border-top:4px solid var(--maccent)}}
@media (max-width:720px){.cp-picker{grid-template-columns:1fr}.cp-col-grid{grid-template-columns:1fr 1fr}.cp-filters3{grid-template-columns:1fr}}
@media (max-width:480px){.cp-herowrap h1{font-size:24px}.cp-col-grid{grid-template-columns:1fr}.cp-li-right{gap:11px}.cp-stat i{font-size:9px}}
@media (prefers-reduced-motion:reduce){.cp-cta,.cp-pick,.cp-chip,.cp-tab,.cp-li{transition:none}.cp-overlay,.cp-modal{animation:none}}
`;
