/**
 * Client for swissvotes-api (https://github.com/pascal-huber/swissvotes-api),
 * mapping its "legislatur" resources into the term/subject shape the store
 * expects (see the previous src/data.js for the shape this replaces).
 */
import { Answer } from '@/Answer.js'

const API_BASE = import.meta.env.VITE_SWISSVOTES_API_URI

// Party-recommendation ("Parole") codes, per the Swissvotes codebook:
// 1 Ja, 2 Nein, 3/5/66 Stimmfreigabe, 4 leer einlegen, 8/9 Gegenentwurf/
// Initiative bevorzugt (Stichfragen). Everything else (missing, ".",
// "9999" = party didn't exist yet) means no recommendation was made.
export function paroleAnswer(code) {
  if (code === '1') return Answer.Yes
  if (code === '2') return Answer.No
  if (code === '3' || code === '4' || code === '5' || code === '66' || code === '8' || code === '9') {
    return Answer.Abstention
  }
  return Answer.Novote
}

// A code counts as "an actual recommendation was given" if it's neither
// unset (".", missing) nor "the organisation didn't exist yet" (9999).
export function hasParoleValue(code) {
  return !!code && code !== '.' && code !== '9999'
}

// The 26 cantons, in the order they appear as top-level fields on a vote
// (e.g. v.zh.annahme, v.zh.japroz). Field "fr" is Fribourg here (distinct
// from the unrelated "fr" referendum-duration fields on the same doc).
export const CANTONS = [
  { code: 'zh', name: 'Zürich' },
  { code: 'be', name: 'Bern' },
  { code: 'lu', name: 'Luzern' },
  { code: 'ur', name: 'Uri' },
  { code: 'sz', name: 'Schwyz' },
  { code: 'ow', name: 'Obwalden' },
  { code: 'nw', name: 'Nidwalden' },
  { code: 'gl', name: 'Glarus' },
  { code: 'zg', name: 'Zug' },
  { code: 'fr', name: 'Freiburg' },
  { code: 'so', name: 'Solothurn' },
  { code: 'bs', name: 'Basel-Stadt' },
  { code: 'bl', name: 'Basel-Landschaft' },
  { code: 'sh', name: 'Schaffhausen' },
  { code: 'ar', name: 'Appenzell Ausserrhoden' },
  { code: 'ai', name: 'Appenzell Innerrhoden' },
  { code: 'sg', name: 'St. Gallen' },
  { code: 'gr', name: 'Graubünden' },
  { code: 'ag', name: 'Aargau' },
  { code: 'tg', name: 'Thurgau' },
  { code: 'ti', name: 'Tessin' },
  { code: 'vd', name: 'Waadt' },
  { code: 'vs', name: 'Wallis' },
  { code: 'ne', name: 'Neuenburg' },
  { code: 'ge', name: 'Genf' },
  { code: 'ju', name: 'Jura' },
]

// The 6 parties tracked in the UI. Kept as id/name 'CVP' (not 'Mitte') to
// match HeaderRow.vue, which already renders the "Die Mitte" logo for
// party.name == 'CVP'. Falls back to the "cvp" column for votes that
// predate the CVP+BDP merger into "Die Mitte" (2021).
const PARTY_FIELDS = [
  { id: 'SP', name: 'SP', code: (p) => p?.sps },
  { id: 'GP', name: 'GP', code: (p) => p?.gps },
  { id: 'GLP', name: 'GLP', code: (p) => p?.glp },
  { id: 'CVP', name: 'CVP', code: (p) => (p?.mitte && p.mitte !== '9999' ? p.mitte : p?.cvp) },
  { id: 'FDP', name: 'FDP', code: (p) => p?.fdp },
  { id: 'SVP', name: 'SVP', code: (p) => p?.svp },
]

function parseDatum(datum) {
  const [day, month, year] = datum.split('.').map(Number)
  return new Date(year, month - 1, day)
}

// Department codes are flat top-level fields named "d1e1".."d3e3" (not
// nested), each level being more specific than the last. "." means unset.
function voteCategories(v) {
  return [1, 2, 3]
    .map((n) => [v[`d${n}e1`], v[`d${n}e2`], v[`d${n}e3`]].filter((c) => c && c !== '.'))
    .filter((cat) => cat.length > 0)
}

function mapVote(v) {
  return {
    id: v.anr,
    date: parseDatum(v.datum),
    name: v.titel?.kurz?.d || v.titel?.off?.d || v.kurzbetitel || `Vorlage ${v.anr}`,
    outcome: v.annahme === '1' ? Answer.Yes : v.annahme === '0' ? Answer.No : undefined,
    categories: voteCategories(v),
    parties: PARTY_FIELDS.map(({ id, code }) => ({ id, answer: paroleAnswer(code(v.p)) })),
    // Full original API document, for detail-page extras (titles, cantonal
    // results, minor-party recommendations, resource links) and the
    // "Rohdaten" raw-JSON dump — see ShowSubject.vue.
    raw: v,
  }
}

function mapLegislatur(entry) {
  if (!entry) return undefined
  return {
    id: entry.legislatur,
    hash: String(entry.legislatur),
    legisjahr: entry.legisjahr,
    start_date: entry.legisjahr_start ? new Date(entry.legisjahr_start, 0, 1) : undefined,
    end_date: entry.legisjahr_end ? new Date(entry.legisjahr_end, 11, 31) : undefined,
    prevHash: entry.previous ? String(entry.previous.legislatur) : undefined,
    nextHash: entry.next ? String(entry.next.legislatur) : undefined,
    parties: PARTY_FIELDS.map(({ id, name }) => ({ id, name })),
    subjects: (entry.votes || []).map(mapVote).sort((a, b) => b.date - a.date),
  }
}

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (response.status === 404) return undefined
  if (!response.ok) {
    throw new Error(`swissvotes-api request failed: ${response.status} ${path}`)
  }
  return response.json()
}

export async function fetchCurrentLegislatur() {
  return mapLegislatur(await apiGet('/legislatur/current'))
}

export async function fetchLegislatur(number) {
  return mapLegislatur(await apiGet(`/legislatur/${number}`))
}
