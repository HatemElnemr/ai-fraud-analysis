import { MATCH_THRESHOLD } from "../../constants";

/**
 * Maps the `compare-fingerprint` response onto the fields the results UI
 * needs.
 *
 * The function's actual shape (verified against the deployed endpoint) is:
 *
 * ```json
 * {
 *   "person":  { "id", "full_name", "nationality", "fingerprint_url", … },
 *   "score":   100,
 *   "reasoning": "Both images are identical fingerprint scans…",
 *   "inputFingerprintType": { "pattern_type", "subtype", "confidence", … }
 * }
 * ```
 *
 * Notes that shaped this code:
 * - `score` is **0–100** (identical → 100, unrelated → 0), not a fraction.
 * - `person` is returned even for a zero score, so it is the *closest* record,
 *   not proof of a match — the verdict comes from `MATCH_THRESHOLD`.
 *
 * Everything is read defensively so an unexpected payload degrades to
 * `status: "unknown"` instead of crashing the page; the raw payload is kept on
 * `payload` for the details card.
 *
 * Returns `{ status, matched, score, person, label, message, fingerprintType,
 * threshold, payload }`.
 */
export function normalizeMatchResult(payload) {
  const empty = {
    status: "unknown",
    matched: null,
    score: null,
    person: null,
    label: "",
    message: "",
    fingerprintType: null,
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

  const score = readNumber(
    payload.score ?? payload.matchScore ?? payload.similarity ?? payload.confidence,
  );
  const person = readPerson(payload);
  const fingerprintType =
    payload.inputFingerprintType &&
    typeof payload.inputFingerprintType === "object"
      ? payload.inputFingerprintType
      : null;

  const message =
    (typeof payload.reasoning === "string" && payload.reasoning) ||
    (typeof payload.message === "string" && payload.message) ||
    (typeof payload.detail === "string" && payload.detail) ||
    "";

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
    person,
    label: person ? readLabel(person) : "",
    message,
    fingerprintType,
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

/** The matched/closest record, across the usual key spellings. */
function readPerson(payload) {
  const raw =
    payload.person ??
    payload.matchedPerson ??
    payload.matched_person ??
    payload.match ??
    payload.record ??
    payload.candidate ??
    payload.matchedRecord ??
    payload.matched_record;
  return raw && typeof raw === "object" ? raw : null;
}

/** Best-effort human label for a record (`name` · `id`). */
function readLabel(record) {
  const name =
    record.full_name ?? record.fullName ?? record.name ?? record.subject ?? "";
  const id = record.record_id ?? record.recordId ?? record.id ?? "";
  if (name && id) return `${name} · ${id}`;
  return String(name || id || "");
}
