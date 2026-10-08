import { supabase } from "../../shared/utils/supabase";
import {
  COMPARE_DOCUMENTS_FUNCTION,
  DOCUMENT_BUCKET,
  DOCUMENTS_TABLE,
  MAX_FILE_BYTES,
  QUERY_UPLOAD_FOLDER,
} from "./constants";

/**
 * Rejects files larger than `MAX_FILE_BYTES` before anything is uploaded.
 * Throws with a message the UI can show as-is.
 */
function assertFileSize(file) {
  if (file.size > MAX_FILE_BYTES) {
    const maxMb = Math.round(MAX_FILE_BYTES / (1024 * 1024));
    throw new Error(`File is too large — the maximum allowed size is ${maxMb} MB.`);
  }
}

/**
 * Reads a File into a `data:` URL, e.g. `data:application/pdf;base64,JVBERi…`.
 *
 * The edge functions take JSON — `{ inputUrl }` or `{ inputBase64 }` — so a
 * file that can't travel as a public URL goes base64-encoded inside the JSON
 * body (multipart/form-data makes them choke: they call `req.json()` on the
 * raw body).
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Could not read the selected document file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Pulls a human-readable message out of a `supabase.functions.invoke` error.
 *
 * `FunctionsHttpError` carries the edge function's response body on
 * `error.context`; parsing it means the user sees the function's own error
 * ("No reference documents found…") instead of a generic "Edge Function
 * returned a non-2xx status code".
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

  return error?.message || "Document comparison failed. Please try again.";
}

/**
 * Uploads a file to `document-bucket` and resolves its public URL.
 *
 * The path is timestamped and sanitized so uploads never collide and never
 * carry path separators from the original file name. Throws on any failure.
 * Returns `{ path, publicUrl }` — the path is kept so callers can address
 * the object again (e.g. a best-effort cleanup).
 */
async function uploadToDocumentBucket(file, folder = "") {
  const safeName = file.name.replace(/[/\\]/g, "-");
  const path = folder
    ? `${folder}/${Date.now()}-${safeName}`
    : `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
  if (uploadError) {
    throw new Error(`Document upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(DOCUMENT_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Could not resolve a public URL for the uploaded document.");
  }

  return { path, publicUrl: data.publicUrl };
}

/**
 * Full document storage flow:
 *   1. upload the file to `document-bucket`
 *   2. resolve its public URL
 *   3. insert the `documents` row (`title`, `file_type`, `context_text`,
 *      `document_url`)
 *
 * Returns the inserted row so the success panel can show the real id and
 * timestamp. Throws on any step so callers can surface the failure in one
 * place. Optional fields are stored as `null` when left empty.
 */
export async function uploadDocument({ title, file, contextText }) {
  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  if (!trimmedTitle) {
    throw new Error("Document title is required.");
  }
  if (!file) {
    throw new Error("Please attach a document file.");
  }
  assertFileSize(file);

  const { publicUrl } = await uploadToDocumentBucket(file);

  const trimmedContext =
    typeof contextText === "string" ? contextText.trim() : "";

  const { data, error } = await supabase
    .from(DOCUMENTS_TABLE)
    .insert({
      title: trimmedTitle,
      file_type: file.type || null,
      context_text: trimmedContext || null,
      document_url: publicUrl,
    })
    .select("id, title, file_type, context_text, document_url, created_at")
    .single();
  if (error) {
    throw new Error(`Could not save the document: ${error.message}`);
  }

  return data;
}

/**
 * True when the function choked on fetching our `inputUrl` (private bucket,
 * expired path, …). Retrying with base64 fixes exactly this class of failure,
 * while business errors ("No reference documents found…") are surfaced
 * as-is instead of burning a second round-trip.
 */
function isImageUrlError(message) {
  return /fetch(?:ing)? (?:the )?image|image from url|status [45]\d\d/i.test(
    message ?? "",
  );
}

/**
 * Calls the `compare-documents` Supabase Edge Function with a document and
 * returns the parsed response.
 *
 * Transport resolution, in order:
 *   1. stage the file in `document-bucket` → `{ inputUrl: publicUrl }`
 *   2. staging refused → `{ inputBase64: "data:…;base64,…" }`
 *   3. `inputUrl` sent but unfetchable by the function → base64 for all
 *      further attempts
 *
 * The JSON contract mirrors `compare-fingerprint` (`inputUrl` / `inputBase64`);
 * unknown keys are ignored by the deployed functions.
 *
 * Throws on any failure (network, non-2xx function response, or an error
 * payload inside a 200 body).
 */
export async function compareDocument(file) {
  if (!file) {
    throw new Error("A document file is required.");
  }
  assertFileSize(file);

  // Staging is best-effort: when the bucket refuses it we fall back to
  // base64 below, so a storage problem never blocks the comparison.
  let inputUrl = null;
  try {
    ({ publicUrl: inputUrl } = await uploadToDocumentBucket(
      file,
      QUERY_UPLOAD_FOLDER,
    ));
  } catch (err) {
    console.warn(
      "[compare-documents] query upload failed, using base64:",
      err?.message,
    );
  }

  let body = inputUrl
    ? { inputUrl }
    : { inputBase64: await fileToDataUrl(file) };

  /** One invocation, including the URL → base64 transport fallback. */
  const invokeOnce = async () => {
    let { data, error } = await supabase.functions.invoke(
      COMPARE_DOCUMENTS_FUNCTION,
      { body },
    );

    if (error) {
      const message = await readFunctionErrorMessage(error);
      if (!body.inputUrl || !isImageUrlError(message)) {
        throw new Error(message);
      }
      // The staged URL wasn't publicly fetchable — switch to base64 for
      // this and every subsequent attempt.
      body = { inputBase64: await fileToDataUrl(file) };
      ({ data, error } = await supabase.functions.invoke(
        COMPARE_DOCUMENTS_FUNCTION,
        { body },
      ));
      if (error) {
        throw new Error(await readFunctionErrorMessage(error));
      }
    }

    if (data === null || data === undefined) {
      throw new Error("The comparison returned an empty response.");
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

  return await invokeOnce();
}
