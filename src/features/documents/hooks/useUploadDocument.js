import { useCallback, useState } from "react";
import { uploadDocument } from "../api";

/**
 * Stateful wrapper around `uploadDocument` for the upload page:
 *
 * ```jsx
 * const { submit, saving, error, savedDocument, reset } = useUploadDocument();
 * await submit({ title, file, contextText }); // null on failure — see `error`
 * ```
 *
 * Never rejects, so the page doesn't need a try/catch: failures land in
 * `error`, the inserted row lands in `savedDocument`.
 */
export function useUploadDocument() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedDocument, setSavedDocument] = useState(null);

  const submit = useCallback(async ({ title, file, contextText }) => {
    setSaving(true);
    setError("");
    setSavedDocument(null);
    try {
      const document = await uploadDocument({ title, file, contextText });
      setSavedDocument(document);
      return document;
    } catch (err) {
      console.error("[documents:upload]", err);
      setError(err.message || "Failed to save the document. Please try again.");
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  /** Clears a stale failure once the user edits the form or picks a file. */
  const clearError = useCallback(() => setError(""), []);

  const reset = useCallback(() => {
    setSavedDocument(null);
    setError("");
    setSaving(false);
  }, []);

  return { submit, saving, error, savedDocument, clearError, reset };
}
