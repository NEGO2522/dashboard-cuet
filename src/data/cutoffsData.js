// Loads and normalizes the real CSAS cutoff/seat data (DU_cutoffs_seats.json)
// and course eligibility text (course_requirements.json), joining them to the
// existing colleges.js / programs.js records by normalized name.
//
// Numeric fields in the source JSON are inconsistently typed (some seat counts
// are strings, and a literal "_" placeholder is used for "not applicable" /
// "no data"), so everything is coerced through toNum() below, which returns
// null for both null and "_" so the UI can render a "-" consistently.

import rawCutoffs from './DU_cutoffs_seats.json';
import rawEligibility from './course_requirements.json';
import { colleges } from './colleges';
import { programs } from './programs';

export const CATEGORIES = ['UR', 'OBC', 'SC', 'ST', 'EWS', 'PwBD'];

function norm(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

// A handful of names differ between DU_cutoffs_seats.json and colleges.js
// (PDF-extraction wording differences, not typos in either file).
const COLLEGE_NAME_ALIASES = {
  'Shaheed Sukhdev College of Business Studies': 'Shaheed Sukhdev College Business Studies',
};

function toNum(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  const s = String(v).trim();
  if (s === '' || s === '_' || s === '-') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

// --- Build name -> record lookups for colleges.js / programs.js ---

const collegeByName = new Map();
colleges.forEach((c) => collegeByName.set(norm(c.name), c));

const programByName = new Map();
programs.forEach((p) => programByName.set(norm(p.name), p));

function resolveCollege(rawName) {
  const n = norm(rawName);
  const aliased = COLLEGE_NAME_ALIASES[n];
  return collegeByName.get(aliased ? norm(aliased) : n) || null;
}

function resolveProgram(rawName) {
  return programByName.get(norm(rawName)) || null;
}

// --- Normalize every cutoff/seats record into a flat "offering" shape ---
// { collegeId, collegeName, programId, programName, college, program,
//   cutoffs: { UR, OBC, SC, ST, EWS, PwBD }, seats: { total, UR, OBC, SC, ST, EWS },
//   rank }
// Every value in cutoffs/seats is either a finite number or null (never "_",
// "", or a string) so callers can rely on `value === null` to mean "no data".

export const offerings = rawCutoffs.map((r) => {
  const college = resolveCollege(r.college);
  const program = resolveProgram(r.program);
  const cutoffs = {};
  const seats = {};
  CATEGORIES.forEach((cat) => { cutoffs[cat] = toNum(r.cutoffs?.[cat]); });
  ['total', 'UR', 'OBC', 'SC', 'ST', 'EWS'].forEach((cat) => { seats[cat] = toNum(r.seats?.[cat]); });

  return {
    collegeId: college?.id || null,
    collegeName: norm(r.college),
    programId: program?.id || null,
    programName: norm(r.program),
    college,
    program,
    campus: r.campus || college?.campus || null,
    gender: r.gender || college?.type || null,
    cutoffs,
    seats,
    rank: toNum(r.rank),
  };
});

// Offerings where we couldn't resolve a matching college or program record.
// Surfaced here so data-quality gaps are visible rather than silently dropped.
export const unmatchedOfferings = offerings.filter((o) => !o.collegeId || !o.programId);

// --- Eligibility text, normalized and keyed by program name ---
// course_requirements.json uses slightly different punctuation/spacing than
// programs.js in some entries (e.g. "B.Sc." vs "B.Sc", stray line breaks), so
// matching falls back to a loosely-normalized key.

function looseNorm(s) {
  return norm(s).toLowerCase().replace(/[.()]/g, '').replace(/\s+/g, ' ').trim();
}

const eligibilityByLooseName = new Map();
rawEligibility.forEach((r) => {
  eligibilityByLooseName.set(looseNorm(r.course), r.eligibility.trim());
});

export function getEligibilityForProgram(programName) {
  return eligibilityByLooseName.get(looseNorm(programName)) || null;
}

// --- Indices used by the Cutoffs page ---

export function buildIndices(offeringsList) {
  const byProgram = new Map();
  const byCollege = new Map();
  offeringsList.forEach((o) => {
    if (o.programId) {
      if (!byProgram.has(o.programId)) byProgram.set(o.programId, []);
      byProgram.get(o.programId).push(o);
    }
    if (o.collegeId) {
      if (!byCollege.has(o.collegeId)) byCollege.set(o.collegeId, []);
      byCollege.get(o.collegeId).push(o);
    }
  });
  return { byProgram, byCollege };
}

// Returns a number, or null if no data is available for this category.
export function getCutoff(offering, category) {
  return offering.cutoffs?.[category] ?? null;
}

// Returns a number, or null if no data is available for this category.
// Callers should render null as "-" rather than treating it as 0 seats,
// since null means "not reported" and 0 would falsely imply zero capacity.
export function getSeats(offering, category) {
  return offering.seats?.[category] ?? null;
}
