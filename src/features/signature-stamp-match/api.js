import { supabase } from "../../shared/utils/supabase";
import { ENTITIES_TABLE, REFERENCE_MARKS_TABLE } from "../reference-marks/constants";
import {
  QUERY_UPLOAD_FOLDER,
  SIGNATURE_STAMP_MATCH_FUNCTION,
} from "./constants";
import { isScoringFailure } from "./matchResult";

/**
 * Delays before re-running a comparison whose candidates could not be scored.
 *
 * The function maps model-availability spikes to a fake verdict (`score: 0`,
 * "No match found", `candidateErrors`) — verified live, where the same call
 * failed once and then succeeded seconds later. Spikes clear quickly, so a
 * couple of paced retries turn a false negative into a real result before the
 * UI ever sees the failure.
 */
const SCORING_RETRY_DELAYS_MS = [2000, 5000];

/** Promise-based sleep for the retry pacing above. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Reads a File into a `data:` URL, e.g. `data:image/png;base64,iVBOR...`.
 *
 * The edge function takes JSON — `{ inputUrl }` or `{ inputBase64 }` — so the
 * image travels either as a public URL or base64-encoded inside the JSON body.
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
 * ("No reference marks found for the given criteria") instead of a generic
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
    return "The verification service returned a response that isn't valid JSON.";
  }

  return error?.message || "Signature/stamp comparison failed. Please try again.";
}

/**
 * Best-effort upload of the query image to the mark's storage bucket.
 *
 * Returns the public URL on success, or `null` when the bucket refuses the
 * upload (RLS, missing bucket, network) — callers then fall back to a base64
 * payload, so a storage problem never blocks verification.
 */
async function uploadQueryImage({ bucket, file }) {
  if (!bucket || !file) return null;

  const safeName = file.name.replace(/[/\\]/g, "-");
  const path = `${QUERY_UPLOAD_FOLDER}/${Date.now()}-${safeName}`;

  try {
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (error) {
      console.warn(
        "[signature-stamp-match] query upload failed, using base64:",
        error.message,
      );
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (!data?.publicUrl) return null;
    return data.publicUrl;
  } catch (err) {
    console.warn(
      "[signature-stamp-match] query upload failed, using base64:",
      err?.message,
    );
    return null;
  }
}

/**
 * True when the function choked on fetching our `inputUrl` (private bucket,
 * expired path, …). Retrying with base64 fixes exactly this class of failure,
 * while business errors ("No reference marks found…") are surfaced as-is
 * instead of burning a second model round-trip.
 */
function isImageUrlError(message) {
  return /fetch(?:ing)? (?:the )?image|image from url|status [45]\d\d/i.test(
    message ?? "",
  );
}

/**
 * Calls the `signature-stamp-match` Supabase Edge Function with a signature
 * or stamp image and returns the parsed response.
 *
 * Transport resolution, in order:
 *   1. upload the query to `bucket` → `{ inputUrl: publicUrl }`
 *   2. upload refused → `{ inputBase64: "data:image/png;base64,…" }`
 *   3. `inputUrl` sent but unfetchable by the function → base64 for all
 *      further attempts
 *
 * When the function answers 200 but no candidate was actually scored
 * (`isScoringFailure` — the model-availability spike described in
 * `SCORING_RETRY_DELAYS_MS`), the call is re-run after a short delay before
 * its payload is handed to the UI.
 *
 * Throws on any failure (network, storage after retry, non-2xx function
 * response, or an error payload inside a 200 body).
 */
export async function matchDocument({ markType, bucket, file }) {
  if (!file) {
    throw new Error("An image file is required.");
  }

  // `markType` is what the deployed function reads; `documentType` mirrors the
  // documented contract. Unknown keys are ignored, so both are safe to send.
  const common = { markType, documentType: markType };

  const imageUrl = await uploadQueryImage({ bucket, file });
  let body = imageUrl
    ? { ...common, inputUrl: imageUrl }
    : { ...common, inputBase64: await fileToDataUrl(file) };

  /** One invocation, including the URL → base64 transport fallback. */
  const invokeOnce = async () => {
    let { data, error } = await supabase.functions.invoke(
      SIGNATURE_STAMP_MATCH_FUNCTION,
      { body },
    );

    if (error) {
      const message = await readFunctionErrorMessage(error);
      if (!body.inputUrl || !isImageUrlError(message)) {
        throw new Error(message);
      }
      // The uploaded URL wasn't publicly fetchable — switch to base64 for
      // this and every subsequent attempt.
      body = { ...common, inputBase64: await fileToDataUrl(file) };
      ({ data, error } = await supabase.functions.invoke(
        SIGNATURE_STAMP_MATCH_FUNCTION,
        { body },
      ));
      if (error) {
        throw new Error(await readFunctionErrorMessage(error));
      }
    }

    if (data === null || data === undefined) {
      throw new Error("The verification returned an empty response.");
    }
    // A 200 body carrying `error` is a failure the status code didn't flag.
    if (
      typeof data === "object" &&
      !Array.isArray(data) &&
      typeof data.error === "string"
    ) {
      throw new Error(data.error);
    }

    return data;
  };

  let data = await invokeOnce();

  for (const delayMs of SCORING_RETRY_DELAYS_MS) {
    if (!isScoringFailure(data)) break;
    console.warn(
      "[signature-stamp-match] candidates could not be scored; retrying in",
      delayMs,
      "ms",
    );
    await sleep(delayMs);
    data = await invokeOnce();
  }

  return data;
}

/** Entity UUIDs — the only ids worth looking up in `entities`. */
const ENTITY_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fills the gaps the edge function's payload leaves in the archive record:
 * the entity's `authority` and the matched mark's `image_url` — the image
 * the "Best Match" panel shows. Neither is in the payload (its entity is
 * just `{ id, name, entity_type }`), but both live in the database.
 *
 * Guarded on every axis: nothing runs without a record, without a UUID id
 * (the documented `recordId` isn't one), or when a field is already filled.
 * The image lookup matches the record's entity + mark type and prefers the
 * row whose label equals the payload's candidate label (the function reports
 * its *closest* mark), falling back to the newest mark for that entity.
 * Lookup failures are swallowed — the UI keeps its "—"/placeholder.
 * Returns the same result object for chaining.
 */
export async function enrichArchiveRecord(result) {
  const record = result?.archiveRecord;
  if (!record || !ENTITY_UUID.test(record.id ?? "")) return result;

  // 1. Authority ← entities.authority
  if (!record.authority) {
    try {
      const { data } = await supabase
        .from(ENTITIES_TABLE)
        .select("authority")
        .eq("id", record.id)
        .maybeSingle();
      const authority =
        typeof data?.authority === "string" ? data.authority.trim() : "";
      if (authority) record.authority = authority;
    } catch {
      /* offline / blocked / missing row — the card keeps its "—" */
    }
  }

  // 2. Best-match image ← reference_marks.image_url
  if (!record.imageUrl) {
    try {
      let request = supabase
        .from(REFERENCE_MARKS_TABLE)
        .select("image_url, label, created_at")
        .eq("entity_id", record.id);
      const markType = result.markType;
      if (markType === "signature" || markType === "stamp") {
        request = request.eq("mark_type", markType);
      }
      const { data } = await request
        .order("created_at", { ascending: false })
        .limit(20);
      const marks = Array.isArray(data) ? data : [];
      const wanted = (result.label ?? "").trim().toLowerCase();
      const chosen =
        (wanted
          ? marks.find((m) => (m.label ?? "").trim().toLowerCase() === wanted)
          : null) ?? marks[0];
      const imageUrl =
        typeof chosen?.image_url === "string" ? chosen.image_url.trim() : "";
      if (imageUrl) record.imageUrl = imageUrl;
    } catch {
      /* keep the SVG placeholder */
    }
  }

  return result;
}
