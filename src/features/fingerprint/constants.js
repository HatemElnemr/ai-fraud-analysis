/** Supabase storage bucket that holds fingerprint images. */
export const FINGERPRINT_BUCKET = "fingerprints";

/** Supabase table that stores subject records. */
export const PEOPLE_TABLE = "people";

/** Supabase Edge Function that matches a fingerprint image against the DB. */
export const COMPARE_FINGERPRINT_FUNCTION = "compare-fingerprint";

/**
 * Similarity score (0–100) at or above which a result is reported as a
 * confirmed match. The function returns a score but no match boolean, so the
 * verdict is decided here — raise it to favour precision over recall.
 */
export const MATCH_THRESHOLD = 85;

/** Route that runs a fingerprint comparison. */
export const ANALYSIS_PATH = "/dashboard/fingerprint-analysis";

/** Route that renders the response of the `compare-fingerprint` function. */
export const ANALYSIS_RESULTS_PATH = `${ANALYSIS_PATH}/results`;

/** Max accepted fingerprint image size, in bytes. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Curated nationality list for the selector. */
export const NATIONALITIES = [
  "Egyptian",
  "Saudi",
  "Emirati",
  "Jordanian",
  "Lebanese",
  "Moroccan",
  "Tunisian",
  "Algerian",
  "Kuwaiti",
  "Qatari",
  "Bahraini",
  "Omani",
  "Iraqi",
  "Syrian",
  "Palestinian",
  "Sudanese",
  "Libyan",
  "Yemeni",
  "American",
  "British",
  "French",
  "German",
  "Italian",
  "Spanish",
  "Canadian",
  "Australian",
  "Indian",
  "Pakistani",
  "Turkish",
  "Chinese",
  "Japanese",
  "Other",
];

/** Generates a short human-readable record identifier. */
export function generateRecordId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REC-${random}`;
}
