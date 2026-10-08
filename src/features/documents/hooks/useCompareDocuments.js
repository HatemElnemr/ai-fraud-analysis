import { useCallback, useState } from "react";
import { compareDocument } from "../api";

/**
 * Stateful wrapper around `compareDocument` for the analysis page:
 *
 * ```jsx
 * const { analyze, loading, error, result, reset } = useCompareDocuments();
 * const result = await analyze(file); // null on failure — see `error`
 * ```
 *
 * Never rejects, so the page doesn't need a try/catch: failures land in
 * `error` and the parsed `compare-documents` payload lands in `result`.
 */
export function useCompareDocuments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const analyze = useCallback(async (file) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await compareDocument(file);
      setResult(data);
      return data;
    } catch (err) {
      console.error("[compare-documents]", err);
      setError(err.message || "Document comparison failed. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Clears a stale failure once the user picks a different file. */
  const clearError = useCallback(() => setError(""), []);

  const reset = useCallback(() => {
    setResult(null);
    setError("");
    setLoading(false);
  }, []);

  return { analyze, loading, error, result, clearError, reset };
}
