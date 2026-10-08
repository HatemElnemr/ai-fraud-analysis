/** Supabase storage bucket that holds uploaded documents. */
export const DOCUMENT_BUCKET = "document-bucket";

/** Supabase table that stores document metadata (one row per stored document). */
export const DOCUMENTS_TABLE = "documents";

/** Supabase Edge Function that compares an input document against the library. */
export const COMPARE_DOCUMENTS_FUNCTION = "compare-documents";

/** Folder inside the bucket where comparison inputs are staged. */
export const QUERY_UPLOAD_FOLDER = "queries";

/** Accepted file extensions for both document pages. */
export const ACCEPTED_DOC_EXTENSIONS = ".pdf,.doc,.docx,.txt";

/** Human-readable list of accepted formats, shown under the dropzones. */
export const ACCEPTED_DOC_FORMATS = "PDF · DOC · DOCX · TXT";

/** Max accepted document size, in bytes. */
export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

/** Route that runs a document comparison. */
export const ANALYSIS_PATH = "/dashboard/document-analysis";
