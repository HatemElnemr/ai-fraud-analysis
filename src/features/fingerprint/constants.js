/** Supabase storage bucket that holds fingerprint images. */
export const FINGERPRINT_BUCKET = "fingerprints";

/** Supabase table that stores subject records. */
export const PEOPLE_TABLE = "people";

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
