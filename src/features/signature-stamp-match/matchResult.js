import { MATCH_THRESHOLD } from "./constants";

/**
 * Maps the `signature-stamp-match` response onto the fields the results UI
 * needs.
 *
 * The deployed function currently answers (verified against the live
 * endpoint):
 *
 * ```json
 * {
 *   "entity":    { "id", "name", "entity_type" },
 *   "markType":  "signature",
 *   "label":     "Youssef Signature",
 *   "score":     91.3,
 *   "reasoning": "The strokes align on …"
 * }
 * ```
 *
 * …or, when nothing clears the archive search, `{ "message": "No match
 * found", "score": 0, "candidateErrors": { … } }`. The documented contract
 * (`matchScore`, `metrics[]`, `archiveRecord{ recordId, authority,
 * registrationDate, name }`) is read too, so either revision of the function
 * drives the same UI.
 *
 * Everything is read defensively: an unexpected payload degrades to
 * `status: "unknown"`, and the raw payload stays on `payload`. The metrics
 * grid is built only from what the response actually carries — the
 * documented `metrics` array, the known fields (`markType`, `label`, entity
 * type), plus a sweep of any other scalar field the function starts
 * returning. Labels the response never reported are omitted entirely (no
 * `—` placeholders), so every tile that renders shows a real value.
 *
 * Returns `{ status, matched, score, metrics, archiveRecord, markType, label,
 * message, threshold, payload }`.
 */
export function normalizeMatchResult(payload, { fallbackMetrics = [] } = {}) {
  const empty = {
    status: "unknown",
    matched: null,
    score: null,
    metrics: [],
    archiveRecord: null,
    markType: null,
    label: "",
    message: "",
    threshold: MATCH_THRESHOLD,
    payload,
  };

  if (payload === null || payload === undefined) return empty;

  // Non-object responses (plain text) can only contribute a message.
  if (typeof payload !== "object" || Array.isArray(payload)) {
    return {
      ...empty,
      message: typeof payload === "string" ? payload : "",
    };
  }

  // The function maps model-availability spikes to a fake verdict (`score: 0`,
  // "No match found") even for an exact self-match — verified live. That `0`
  // is an outage artifact, not a measurement: report the run as inconclusive
  // with the real reason, never as a confident "No Match Found".
  if (isScoringFailure(payload)) {
    return {
      ...empty,
      status: "unknown",
      markType: readString(payload.markType ?? payload.documentType),
      message: `The comparison did not complete: ${readCandidateErrors(payload).join(" · ")}`,
      payload,
    };
  }

  const score = readNumber(
    payload.matchScore ?? payload.score ?? payload.similarity ?? payload.confidence,
  );
  const archiveRecord = readArchiveRecord(payload);
  // Whatever the response carries becomes metrics — see `buildMetrics`.
  const metrics = buildMetrics(payload, archiveRecord, fallbackMetrics);
  const label = readString(payload.label ?? payload.markLabel ?? payload.candidateLabel);

  // The label the function prints for the candidate lives at the top level;
  // hoist it onto the record so the card can show it.
  if (archiveRecord && !archiveRecord.label) archiveRecord.label = label;

  // Same for the matched mark's storage URL: the function returns it at the
  // top level, and the Best Match panel reads `archiveRecord.imageUrl`.
  const payloadImageUrl = readString(payload.imageUrl ?? payload.image_url);
  if (archiveRecord && !archiveRecord.imageUrl && payloadImageUrl) {
    archiveRecord.imageUrl = payloadImageUrl;
  }

  const markType = readString(payload.markType ?? payload.documentType);
  const message = readReasoning(payload);

  // Prefer an explicit verdict if the function ever returns one; otherwise
  // derive it from the score.
  let matched = readExplicitMatch(payload);
  if (matched === null && score !== null) matched = score >= MATCH_THRESHOLD;

  const status =
    matched === true ? "match" : matched === false ? "no-match" : "unknown";

  return {
    status,
    matched,
    score,
    metrics,
    archiveRecord,
    markType,
    label,
    message,
    threshold: MATCH_THRESHOLD,
    payload,
  };
}

/** Reads a boolean verdict from `match`/`isMatch`/`matched`, if present. */
function readExplicitMatch(payload) {
  const raw = payload.matched ?? payload.isMatch ?? payload.match;
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") {
    const value = raw.trim().toLowerCase();
    if (["match", "matched", "true", "yes"].includes(value)) return true;
    if (["no-match", "nomatch", "no match", "false", "no"].includes(value)) {
      return false;
    }
  }
  return null;
}

/** Coerces `100`, `"100"` or `"100%"` into a number; anything else → null. */
function readNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace("%", ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/** Trims a value to a non-empty string, or null. */
function readString(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

/** Unique, non-empty messages from the response's `candidateErrors` map. */
function readCandidateErrors(payload) {
  const errors = payload?.candidateErrors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return [];
  return [
    ...new Set(
      Object.values(errors)
        .filter((value) => typeof value === "string" && value.trim())
        .map((value) => value.trim()),
    ),
  ];
}

/**
 * True when the function answered 200 but **no candidate was actually
 * scored** — the shape observed during model-availability spikes:
 *
 * ```json
 * { "message": "No match found", "score": 0,
 *   "candidateErrors": { "…": "This model is currently experiencing high demand…" } }
 * ```
 *
 * The `score: 0` there is an outage artifact, not a measurement: an exact
 * self-match produced it too (verified live; the retry succeeded seconds
 * later with `score: 100`). Callers must not report it as a verdict —
 * `matchDocument` retries it, and `normalizeMatchResult` classifies it as
 * inconclusive.
 *
 * A response with reasoning or a returned record means the model *did* run,
 * so those keep their real verdict.
 */
export function isScoringFailure(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  if (payload.reasoning) return false;
  if (readArchiveRecord(payload) !== null) return false;
  if (readCandidateErrors(payload).length === 0) return false;

  const score = readNumber(
    payload.matchScore ?? payload.score ?? payload.similarity ?? payload.confidence,
  );
  return score === null || score === 0;
}

/** ISO timestamp → local date/time; anything else kept verbatim; empty → null. */
function readDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleString();
  }
  return readString(value) ?? String(value);
}

/**
 * Normalizes the `metrics` payload into `[{ k, v }]`.
 *
 * Accepts the documented array of `{ k, v }` / `{ key, value }` / `{ label,
 * value }` rows, plain `"Name: value"` strings, or an object map
 * (`{ "Pen Pressure": "Heavy" }`). Rows whose value can't be read are
 * dropped, never rendered as an empty tile. Anything else → null, leaving
 * the other sources in `buildMetrics` to fill the grid.
 */
function readMetrics(value) {
  if (Array.isArray(value)) {
    const rows = value
      .map((entry) => normalizeMetricEntry(entry))
      .filter(Boolean);
    return rows.length > 0 ? rows : null;
  }

  if (value && typeof value === "object") {
    const rows = Object.entries(value)
      .map(([k, v]) => {
        const key = readString(k);
        if (!key) return null;
        const rowValue = readMetricValue(v);
        return rowValue ? { k: key, v: rowValue } : null;
      })
      .filter(Boolean);
    return rows.length > 0 ? rows : null;
  }

  return null;
}

/**
 * One metric value → the string the grid should show, or `null` when there
 * is nothing to show (missing, empty, or an unreadable type).
 *
 * Numbers keep their exact value (`0` → `"0"`), booleans read as Yes/No,
 * and `{ v }` / `{ value }` wrappers are unwrapped — so a declared
 * `ringGeometry: true` renders "Yes", never a blank tile.
 */
function readMetricValue(rawValue) {
  const value =
    rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? rawValue.v ?? rawValue.value
      : rawValue;

  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return null;
}

/** One array entry → `{ k, v }`, or null when it carries no readable pair. */
function normalizeMetricEntry(entry) {
  if (typeof entry === "string") {
    const separator = entry.indexOf(":");
    if (separator > 0) {
      const k = entry.slice(0, separator).trim();
      const v = entry.slice(separator + 1).trim();
      return k && v ? { k, v } : null;
    }
    return null;
  }

  if (!entry || typeof entry !== "object") return null;

  const k = readString(
    entry.k ?? entry.key ?? entry.name ?? entry.label ?? entry.metric ?? entry.title,
  );
  if (!k) return null;

  const v = readMetricValue(
    entry.v ??
      entry.value ??
      entry.val ??
      entry.result ??
      entry.reading ??
      entry.score ??
      entry.measurement,
  );
  if (!v) return null;

  return { k, v };
}

/**
 * Payload keys whose data is rendered elsewhere, so the metrics sweep must
 * not duplicate them: the score (banner + threshold bar), the verdict, the
 * record (archive card), the explanation (reasoning card), and keys handled
 * by the explicit rows below. Compared case-insensitively.
 */
const CONSUMED_METRIC_KEYS = new Set([
  "score",
  "matchscore",
  "similarity",
  "matched",
  "ismatch",
  "match",
  "metrics",
  "archiverecord",
  "archive_record",
  "archive",
  "entity",
  "person",
  "record",
  "matchedrecord",
  "matched_record",
  "matchedperson",
  "matched_person",
  "candidate",
  "reasoning",
  "message",
  "detail",
  "candidateerrors",
  "marktype",
  "documenttype",
  "label",
  "marklabel",
  "candidatelabel",
]);

/** `ink_density` / `entityType` / `signature` → `Ink Density` / `Entity Type` / `Signature`. */
function titleCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Comparison form of a metric label: title-cased, then stripped of any
 * parenthetical unit/qualifier — `Ink Density (%)`, `ink_density`, and
 * "Ink Density" all collapse to `ink density`, so the same measurement
 * dedupes across sources and a unit-suffixed response label still matches
 * its configured counterpart.
 */
function compareLabel(value) {
  return titleCase(value)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Builds the metrics grid **strictly from the response** — every tile that
 * renders carries a value the function actually returned; nothing is
 * invented and nothing renders empty:
 *
 *   • the documented `metrics` payload (array of rows or object map) is
 *     authoritative: all its rows render, whatever they are named — the
 *     function may word a label differently from the config or suffix it
 *     with a unit (`Ink Density (%)`)
 *   • the three response-derived rows: Mark Type, Record Label, Entity Type
 *   • a sweep of other top-level payload scalars, restricted to this
 *     feature's configured labels (`fallbackMetrics`), so a measurement sent
 *     at the top level — `algorithm`, `inkDensity`, … — still surfaces while
 *     junk (`status`, `imageUrl`, undocumented keys) stays out
 *
 * Labels the response never reported are simply omitted — the grid never
 * shows a `—` placeholder for a measurement that doesn't exist.
 *
 * Keys are normalized before display and dedupe: `pen_pressure`,
 * `penPressure`, and "pen pressure" all become "Pen Pressure" (capitalized,
 * spaced), and `Estimated Diameter (mm)` dedupes against `Estimated
 * Diameter` so the same measurement never appears twice. Excluded by
 * design: the score (banner + threshold bar), `reasoning` (reasoning card),
 * and record/error objects (their own cards).
 */
function buildMetrics(payload, archiveRecord, fallbackMetrics) {
  const rows = [];
  const seen = new Set();

  // The allowlist for the top-level sweep: this feature's expected
  // measurements + the fixed response-derived rows, compared
  // case-insensitively (and unit-suffix-free) after title-casing.
  const allowed = new Set(
    [...(fallbackMetrics ?? []), "Mark Type", "Record Label", "Entity Type"]
      .map((label) => compareLabel(label))
      .filter(Boolean),
  );

  /**
   * Adds one `{ k, v }` row — after normalizing the key: `pen_pressure`,
   * `penPressure`, and "pen pressure" all become "Pen Pressure", so every
   * grid title is capitalized with spaces (never underscores).
   *
   * `requireAllowlist` (default true) is what keeps extra top-level
   * response data out of the grid; the response's own `metrics` rows bypass
   * it. Rows without a readable value are dropped, so the grid never
   * renders an empty tile. Dedupe then works across the declared / derived
   * / sweep sources that may name the same metric differently.
   */
  const push = (rawKey, rawValue, { requireAllowlist = true } = {}) => {
    if (rawKey === null || rawKey === undefined) return;
    const k = titleCase(rawKey);
    if (!k) return;
    const key = compareLabel(k);
    if (!key) return;
    if (requireAllowlist && !allowed.has(key)) return;
    let v = rawValue;
    if (typeof v === "string") {
      v = v.trim();
      if (!v) return;
    }
    if (v === null || v === undefined) return;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ k, v: String(v) });
  };

  // 1. Documented `metrics` payload — authoritative, bypasses the allowlist.
  for (const row of readMetrics(payload.metrics) ?? []) {
    push(row.k, row.v, { requireAllowlist: false });
  }

  // 2. Known response fields.
  const markType = readString(payload.markType ?? payload.documentType);
  if (markType) push("Mark Type", titleCase(markType));
  // Label may sit at the top level (live response) or inside the record
  // (documented schema).
  const label = readString(
    payload.label ??
      payload.markLabel ??
      payload.candidateLabel ??
      archiveRecord?.label,
  );
  if (label) push("Record Label", label);
  if (archiveRecord?.entityType) push("Entity Type", titleCase(archiveRecord.entityType));

  // 3. Sweep every other scalar the function sends (allowlist-checked).
  for (const key of Object.keys(payload)) {
    if (CONSUMED_METRIC_KEYS.has(key.toLowerCase())) continue;
    const value = payload[key];
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue; // arrays/objects handled above
    if (typeof value === "boolean") {
      push(titleCase(key), value ? "Yes" : "No");
    } else {
      push(titleCase(key), value);
    }
  }

  return rows;
}

/**
 * The matched/closest archive record, across the usual key spellings.
 *
 * Returns `null` when the payload carries no record object at all (the UI
 * then shows its "no candidate" note); otherwise every field is read safely
 * and may be null, which the card renders as `—`.
 */
function readArchiveRecord(payload) {
  const candidates = [
    payload.archiveRecord,
    payload.archive_record,
    payload.archive,
    payload.entity,
    payload.person,
    payload.record,
    payload.matchedRecord,
    payload.matched_record,
    payload.matchedPerson,
    payload.matched_person,
    payload.candidate,
    payload.match,
  ];
  const raw = candidates.find(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  );
  if (!raw) return null;

  return {
    id: readString(raw.recordId ?? raw.record_id ?? raw.id),
    name: readString(
      raw.name ?? raw.full_name ?? raw.fullName ?? raw.entityName ?? raw.subject,
    ),
    authority: readString(
      raw.authority ??
        raw.issuingAuthority ??
        raw.issuing_authority ??
        raw.issuingBody ??
        raw.issuing_body ??
        raw.organization,
    ),
    registeredAt: readDate(
      raw.registrationDate ??
        raw.registration_date ??
        raw.registeredAt ??
        raw.registered_at ??
        raw.registered ??
        raw.created_at ??
        raw.createdAt,
    ),
    label: readString(raw.label ?? raw.markLabel ?? raw.title),
    entityType: readString(raw.entity_type ?? raw.entityType),
    imageUrl: readString(raw.imageUrl ?? raw.image_url ?? raw.markUrl ?? raw.mark_url),
  };
}

/**
 * The analyst-facing explanation: `reasoning`, else `message`/`detail`, plus
 * any per-candidate failures (e.g. a model-overload note) so a silent
 * degradation never looks like a confident verdict.
 */
function readReasoning(payload) {
  const parts = [];

  const main = readString(payload.reasoning) ?? readString(payload.message) ?? readString(payload.detail);
  if (main) parts.push(main);

  const errors = payload.candidateErrors;
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    for (const value of Object.values(errors)) {
      const text = readString(value);
      if (text && !parts.includes(text)) parts.push(text);
    }
  }

  return parts.join(" ");
}
