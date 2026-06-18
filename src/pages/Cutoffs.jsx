import React, { useState, useMemo, useEffect } from 'react';
import { colleges } from '../data/colleges';
import { programs } from '../data/programs';
import {
  offerings,
  CATEGORIES,
  buildIndices,
  getCutoff,
  getSeats,
  getEligibilityForProgram,
} from '../data/cutoffsData';
import { SourceBadge } from '../components/SourceBadge';
import './Cutoffs.css';

const SUBJECT_GROUPS = {
  Commerce: { label: 'Commerce', color: '#2563eb' },
  Humanities: { label: 'Humanities', color: '#7c3aed' },
  Science: { label: 'Science', color: '#059669' },
};

function nf(n) {
  return (n || 0).toLocaleString('en-IN');
}

function groupColor(group) {
  return SUBJECT_GROUPS[group]?.color || '#64748b';
}

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
        <span className="cf-ringwrap"><Ring value={top} color={accent} /><i>highest cutoff</i></span>
      </span>
      <span className="cf-li-go">›</span>
    </button>
  );
}

function DetailModal({ open, onClose, mode, item, indices }) {
  const [view, setView] = useState('cutoffs');
  const [score, setScore] = useState('');

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !item) return null;

  const numScore = score === '' ? null : Math.max(0, Math.min(1000, Number(score) || 0));
  let title, accent, rows;

  if (mode === 'program') {
    const p = item;
    accent = groupColor(p.subjectGroup);
    title = 'Colleges offering ' + p.name;
    const offs = indices.byProgram.get(p.id) || [];
    rows = offs.map((o) => ({
      key: o.collegeId,
      name: o.college ? o.college.name : o.collegeName,
      campus: o.college?.campus,
      women: o.college?.type === 'Women' || o.gender === 'Female',
      cutoffs: CATEGORIES.map((cat) => getCutoff(o, cat)),
      seats: CATEGORIES.map((cat) => (cat === 'PwBD' ? null : getSeats(o, cat))),
    }));
  } else {
    const c = item;
    accent = '#2563eb';
    title = 'Programs at ' + c.name;
    const offs = indices.byCollege.get(c.id) || [];
    rows = offs.map((o) => ({
      key: o.programId,
      name: o.program ? o.program.name : o.programName,
      group: o.program?.subjectGroup,
      cutoffs: CATEGORIES.map((cat) => getCutoff(o, cat)),
      seats: CATEGORIES.map((cat) => (cat === 'PwBD' ? null : getSeats(o, cat))),
    }));
  }

  rows.sort((a, b) => (b.cutoffs[0] || 0) - (a.cutoffs[0] || 0));

  return (
    <div className="cf-overlay" onClick={onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ '--maccent': accent }}>
        <div className="cf-modal-head">
          <div className="cf-modal-title">{title}</div>
          <button className="cf-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="cf-modal-tools">
          <div className="cf-tabs">
            <span className="cf-tabs-label">View</span>
            <button className={'cf-tab ' + (view === 'seats' ? 'on' : '')} onClick={() => setView('seats')}>Seats</button>
            <button className={'cf-tab ' + (view === 'cutoffs' ? 'on' : '')} onClick={() => setView('cutoffs')}>Cutoffs</button>
          </div>
          {view === 'cutoffs' && (
            <input
              className="cf-scorein"
              type="number"
              inputMode="numeric"
              placeholder="Your CUET score → where you qualify lights up"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              max={1000}
              min={0}
            />
          )}
        </div>
        <div className="cf-tablewrap">
          <table className="cf-table">
            <thead>
              <tr>
                <th className="cf-th-name">{mode === 'program' ? 'College' : 'Program'}</th>
                {CATEGORIES.map((c) => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={CATEGORIES.length + 1} style={{ textAlign: 'center', padding: '2rem' }}>No data available.</td></tr>
              )}
              {rows.map((r) => {
                const vals = view === 'cutoffs' ? r.cutoffs : r.seats;
                return (
                  <tr key={r.key}>
                    <td className="cf-td-name">
                      <span className="cf-td-name-text">{r.name}</span>
                      {(r.women || (r.campus && r.campus !== 'Off') || r.group) && (
                        <span className="cf-td-badges">
                          {r.women && <span className="cf-badge-w">Women</span>}
                          {r.campus && r.campus !== 'Off' && (
                            <span className="cf-badge-campus">{r.campus} Campus</span>
                          )}
                          {r.group && (
                            <span className="cf-badge-s" style={{ color: groupColor(r.group), background: groupColor(r.group) + '14' }}>
                              {r.group}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    {vals.map((v, i) => {
                      const isCut = view === 'cutoffs';
                      const q = isCut && numScore !== null && v !== null && numScore >= v;
                      return (
                        <td key={i} className={'cf-num-cell ' + (q ? 'cf-q' : '')}>
                          {v === null || v === undefined ? <span className="cf-dash">-</span> : (isCut ? v.toFixed(1) : v)}
                          {q && <i className="cf-tick">✓</i>}
                        </td>
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

export function Cutoffs() {
  const [mode, setMode] = useState('program');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [campus, setCampus] = useState('all');
  const [sort, setSort] = useState('seats');
  const [selected, setSelected] = useState(null);

  const indices = useMemo(() => buildIndices(offerings), []);

  const programAgg = useMemo(() => {
    const map = new Map();
    programs.forEach((p) => {
      const offs = indices.byProgram.get(p.id) || [];
      let totalSeats = null;
      let topCutoff = 0;
      offs.forEach((o) => {
        const s = getSeats(o, 'total');
        if (s !== null) totalSeats = (totalSeats || 0) + s;
        const c = getCutoff(o, 'UR');
        if (c && c > topCutoff) topCutoff = c;
      });
      map.set(p.id, { count: offs.length, totalSeats, topCutoff });
    });
    return map;
  }, [indices]);

  const collegeAgg = useMemo(() => {
    const map = new Map();
    colleges.forEach((c) => {
      const offs = indices.byCollege.get(c.id) || [];
      let totalSeats = null;
      let topCutoff = 0;
      offs.forEach((o) => {
        const s = getSeats(o, 'total');
        if (s !== null) totalSeats = (totalSeats || 0) + s;
        const cut = getCutoff(o, 'UR');
        if (cut && cut > topCutoff) topCutoff = cut;
      });
      map.set(c.id, { count: offs.length, totalSeats, topCutoff });
    });
    return map;
  }, [indices]);

  const totalSeatsAll = useMemo(() => {
    let sum = 0;
    collegeAgg.forEach((v) => { sum += v.totalSeats || 0; });
    return sum;
  }, [collegeAgg]);

  const programList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = programs
      .filter((p) => (group === 'all' || p.subjectGroup === group) && (!q || p.name.toLowerCase().includes(q)))
      .map((p) => ({
        ...p,
        ...(programAgg.get(p.id) || { count: 0, totalSeats: null, topCutoff: 0 }),
        eligibility: p.eligibility || getEligibilityForProgram(p.name),
      }))
      .filter((p) => p.count > 0);
    list.sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'cutoff') return b.topCutoff - a.topCutoff;
      if (sort === 'colleges') return b.count - a.count;
      return (b.totalSeats || 0) - (a.totalSeats || 0);
    });
    return list;
  }, [query, group, sort, programAgg]);

  const collegeList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = colleges
      .filter((c) => (campus === 'all' || (campus === 'women' ? c.type === 'Women' : c.campus === campus)) && (!q || c.name.toLowerCase().includes(q)))
      .map((c) => ({ ...c, ...(collegeAgg.get(c.id) || { count: 0, totalSeats: null, topCutoff: 0 }) }))
      .filter((c) => c.count > 0);
    list.sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      if (sort === 'cutoff') return b.topCutoff - a.topCutoff;
      if (sort === 'colleges') return b.count - a.count;
      return (b.totalSeats || 0) - (a.totalSeats || 0);
    });
    return list;
  }, [query, campus, sort, collegeAgg]);

  const campusOptions = useMemo(() => {
    const set = new Set(colleges.map((c) => c.campus));
    return Array.from(set).filter((c) => c !== 'Various').sort();
  }, []);

  return (
    <div className="cf-wrap">
      <section className="cf-herowrap">
        <span className="cf-herobadge">CSAS 2025 · Official seat matrix</span>
        <h1>DU Cutoff &amp; Seat Explorer</h1>
        <p>Browse every Delhi University program and college. Tap a row for category-wise seats and cutoffs.</p>
      </section>

      <div className="cf-statstrip">
        <div className="cf-kpi"><b>{programList.length}</b><span>Programs</span></div>
        <div className="cf-divider" />
        <div className="cf-kpi"><b>{collegeList.length}</b><span>Colleges</span></div>
        <div className="cf-divider" />
        <div className="cf-kpi"><b>{nf(totalSeatsAll)}</b><span>Seats</span></div>
        <div className="cf-divider" />
        <div className="cf-kpi"><b>{CATEGORIES.length}</b><span>Categories</span></div>
      </div>

      <div className="cf-seg" data-on={mode}>
        <button className={mode === 'program' ? 'on' : ''} onClick={() => { setMode('program'); setQuery(''); }}>Browse by Program</button>
        <button className={mode === 'college' ? 'on' : ''} onClick={() => { setMode('college'); setQuery(''); }}>Browse by College</button>
        <span className="cf-seg-knob" />
      </div>

      <div className="cf-controls">
        <input
          className="cf-search"
          placeholder={mode === 'program' ? 'Search programs…' : 'Search colleges…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="cf-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="seats">Most seats</option>
          <option value="cutoff">Highest cutoff</option>
          <option value="colleges">{mode === 'program' ? 'Most colleges' : 'Most programs'}</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      <div className="cf-filters">
        {mode === 'program' ? (
          <>
            <button className={'cf-chip ' + (group === 'all' ? 'on' : '')} onClick={() => setGroup('all')}>All</button>
            {Object.entries(SUBJECT_GROUPS).map(([k, v]) => (
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
        <div className="cf-count">Showing {mode === 'program' ? programList.length + ' programs' : collegeList.length + ' colleges'}</div>
        <SourceBadge date="CSAS 2025" />
      </div>

      <main className="cf-list">
        {mode === 'program'
          ? programList.map((p) => (
              <ListRow
                key={p.id}
                title={p.name}
                sub={p.subjectGroup}
                accent={groupColor(p.subjectGroup)}
                count={p.count}
                countLabel="colleges"
                seats={p.totalSeats}
                top={p.topCutoff}
                onOpen={() => setSelected({ mode: 'program', item: p })}
              />
            ))
          : collegeList.map((c) => (
              <ListRow
                key={c.id}
                title={c.name}
                sub={c.campus + ' · ' + c.type}
                accent="#2563eb"
                count={c.count}
                countLabel="programs"
                seats={c.totalSeats}
                top={c.topCutoff}
                onOpen={() => setSelected({ mode: 'college', item: c })}
              />
            ))}
        {((mode === 'program' && !programList.length) || (mode === 'college' && !collegeList.length)) && (
          <div className="cf-empty">Nothing matches that search.</div>
        )}
      </main>

      <footer className="cf-foot">
        <p>Official CSAS 2025 seat matrix and cutoff scores. "Highest cutoff" shown on each row is the UR (Unreserved) category cutoff at the toughest college or program in that group — tap a row to see every category and college. A "-" means that figure wasn't reported in the official data.</p>
      </footer>

      <DetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        mode={selected?.mode}
        item={selected?.item}
        indices={indices}
      />
    </div>
  );
}
