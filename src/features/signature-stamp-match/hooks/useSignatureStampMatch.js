import { useCallback, useState } from "react";
import { matchDocument } from "../api";

/**
 * Stateful wrapper around `matchDocument` for the analysis pages:
 *
 * ```jsx
 * const { match, loading, error, reset } = useSignatureStampMatch({
 *   markType: "signature",
 *   bucket: "signature-bucket",
 * });
 * const data = await match(file); // null on failure — see `error`
 * ```
 *
 * Mirrors `useCompareFingerprint`: never rejects, so pages don't need a
 * try/catch — failures land in `error` and are surfaced through `ErrorBanner`.
 */
export function useSignatureStampMatch({ markType, bucket } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const match = useCallback(
    async (file) => {
      setLoading(true);
      setError("");
      setResult(null);
      try {
        const data = await matchDocument({ markType, bucket, file });
        setResult(data);
        return data;
      } catch (err) {
        console.error("[signature-stamp-match]", err);
        setError(err.message || "Signature/stamp comparison failed.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [markType, bucket],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError("");
    setLoading(false);
  }, []);

  return { match, loading, error, result, reset };
}
