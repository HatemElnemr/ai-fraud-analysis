import { useCallback, useState } from "react";
import { supabase } from "../../../shared/utils/supabase";
import { COMPARE_FINGERPRINT_FUNCTION } from "../constants";

/**
 * Reads a File into a `data:` URL, e.g. `data:image/png;base64,iVBOR...`.
 *
 * The edge function takes JSON — `{ inputUrl }` or `{ inputBase64 }` — so the
 * image travels base64-encoded inside the JSON body (multipart/form-data
 * makes it choke: it calls `req.json()` on the raw body).
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Could not read the selected image file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Pulls a human-readable message out of a `supabase.functions.invoke` error.
 *
 * `FunctionsHttpError` carries the edge function's response body on
 * `error.context`; parsing it means the user sees the function's own error
 * ("Please provide either 'inputUrl' or 'inputBase64'") instead of a generic
 * "Edge Function returned a non-2xx status code".
 */
async function readFunctionErrorMessage(error) {
  try {
    const context = error?.context;
    if (context && typeof context.text === "function") {
      const raw = await context.text();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const fromBody =
            parsed?.error?.message ?? parsed?.error ?? parsed?.message;
          if (fromBody) return String(fromBody);
        } catch {
          /* body wasn't JSON — fall through to the raw text */
        }
        return raw;
      }
    }
  } catch {
    /* reading the body failed — fall back to the error message */
  }

  // A SyntaxError here means the function answered 200 with a non-JSON body.
  if (error instanceof SyntaxError) {
    return "The comparison service returned a response that isn't valid JSON.";
  }

  return error?.message || "Fingerprint comparison failed. Please try again.";
}

/**
 * Calls the `compare-fingerprint` Supabase Edge Function with a fingerprint
 * image and returns the parsed response.
 *
 * The image is sent as JSON (`{ inputBase64: "data:image/png;base64,…" }`)
 * because the function parses its body with `req.json()`.
 *
 * Throws on any failure.
 */
export async function compareFingerprint(file) {
  if (!file) {
    throw new Error("A fingerprint image is required.");
  }

  const body = { inputBase64: await fileToDataUrl(file) };

  const { data, error } = await supabase.functions.invoke(
    COMPARE_FINGERPRINT_FUNCTION,
    { body },
  );

  if (error) {
    throw new Error(await readFunctionErrorMessage(error));
  }
  if (data === null || data === undefined) {
    throw new Error("The comparison returned an empty response.");
  }

  return data;
}

/**
 * Stateful wrapper around `compareFingerprint` for components:
 *
 * ```jsx
 * const { compare, loading, error, reset } = useCompareFingerprint();
 * const result = await compare(file); // null on failure — see `error`
 * ```
 *
 * Never rejects, so pages don't need a try/catch: failures land in `error`.
 */
export function useCompareFingerprint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const compare = useCallback(async (file) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await compareFingerprint(file);
      setResult(data);
      return data;
    } catch (err) {
      console.error("[compare-fingerprint]", err);
      setError(err.message || "Fingerprint comparison failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError("");
    setLoading(false);
  }, []);

  return { compare, loading, error, result, reset };
}
