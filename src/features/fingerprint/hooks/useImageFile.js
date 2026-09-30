import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_FILE_BYTES } from "../constants";

/**
 * Shared image-file state for the fingerprint pages: selection, validation,
 * object-URL preview, and cleanup.
 *
 * ```jsx
 * const { file, preview, error, load, clear } = useImageFile();
 * ```
 *
 * `detach()` hands ownership of the preview URL to someone else (e.g. the
 * results route) so this hook's unmount cleanup won't revoke a URL that is
 * still being displayed elsewhere.
 */
export function useImageFile({ maxBytes = MAX_FILE_BYTES } = {}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const previewRef = useRef(null);

  /** Revoke the current preview URL (if any) and forget about it. */
  const revoke = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
  }, []);

  /** Validate + load an image picked through the dropzone or file input. */
  const load = useCallback(
    (nextFile) => {
      if (!nextFile) return;
      if (!nextFile.type.startsWith("image/")) {
        setError("Please choose a valid image file.");
        return;
      }
      if (nextFile.size > maxBytes) {
        setError("Image is too large. Maximum size is 10 MB.");
        return;
      }
      revoke();
      const url = URL.createObjectURL(nextFile);
      previewRef.current = url;
      setFile(nextFile);
      setPreview(url);
      setError("");
    },
    [maxBytes, revoke],
  );

  /** Drop the loaded file and revoke its preview URL. */
  const clear = useCallback(() => {
    revoke();
    setFile(null);
    setPreview(null);
    setError("");
  }, [revoke]);

  /** Stop revoking the preview URL on unmount — it now belongs elsewhere. */
  const detach = useCallback(() => {
    previewRef.current = null;
  }, []);

  useEffect(() => revoke, [revoke]);

  return { file, preview, error, load, clear, detach };
}
