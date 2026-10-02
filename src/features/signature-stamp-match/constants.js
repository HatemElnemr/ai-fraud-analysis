/** Supabase Edge Function that matches a signature/stamp against the archive. */
export const SIGNATURE_STAMP_MATCH_FUNCTION = "signature-stamp-match";

/**
 * Similarity score (0–100) at or above which a result is reported as a
 * confirmed match. The function returns a score but no match boolean, so the
 * verdict is decided here — raise it to favour precision over recall.
 */
export const MATCH_THRESHOLD = 80;

/**
 * Mark types the edge function understands. Sent as `markType` (the key the
 * deployed function actually reads to pick the archive) and as `documentType`
 * (the documented spelling) so either contract revision keeps working.
 */
export const DOCUMENT_TYPES = {
  SIGNATURE: "signature",
  STAMP: "stamp",
};

/**
 * Folder inside each mark's storage bucket that holds verification queries.
 * Query images live apart from the archived reference marks
 * (`<entityId>/…` paths) so the two never mix.
 */
export const QUERY_UPLOAD_FOLDER = "queries";
