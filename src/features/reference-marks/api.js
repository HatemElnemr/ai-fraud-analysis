import { supabase } from "../../shared/utils/supabase";
import { ENTITIES_TABLE, REFERENCE_MARKS_TABLE } from "./constants";

/**
 * Typeahead search over `entities` by name.
 * Returns an array of `{ id, name, entity_type, authority }`. Throws on failure.
 */
export async function searchEntities(query, limit = 8) {
  const { data, error } = await supabase
    .from(ENTITIES_TABLE)
    .select("id, name, entity_type, authority")
    .ilike("name", `%${query.replace(/[%_\\]/g, "")}%`)
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw new Error(`Entity search failed: ${error.message}`);
  return data ?? [];
}

/**
 * Insert a row into `entities` and return it as
 * `{ id, name, entity_type, authority }`. Throws on failure.
 */
export async function createEntity({ name, entity_type, authority }) {
  const { data, error } = await supabase
    .from(ENTITIES_TABLE)
    .insert({
      name,
      entity_type,
      authority: authority?.trim() || null,
    })
    .select("id, name, entity_type, authority")
    .single();
  if (error) throw new Error(`Could not create entity: ${error.message}`);
  return data;
}

/**
 * Full reference-mark submission flow:
 *   1. upload the image to `bucket` under an entity-scoped path
 *   2. resolve its public URL
 *   3. insert the `reference_marks` row
 *
 * Returns the stored `image_url`. Throws on any step so callers can
 * surface the failure in one place.
 */
export async function archiveReferenceMark({
  bucket,
  markType,
  entityId,
  label,
  file,
}) {
  const path = `${entityId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!urlData?.publicUrl) {
    throw new Error("Could not resolve a public URL for the uploaded image.");
  }

  const { error: insertError } = await supabase
    .from(REFERENCE_MARKS_TABLE)
    .insert({
      entity_id: entityId,
      mark_type: markType,
      label: label?.trim() || null,
      image_url: urlData.publicUrl,
    });
  if (insertError) {
    throw new Error(`Could not save the record: ${insertError.message}`);
  }

  return urlData.publicUrl;
}

/**
 * Reference marks for the edit screen — newest first, each joined with its
 * entity so the list can show who the mark belongs to. `query` filters on
 * the mark's label (case-insensitive). `entity` is null when the linked row
 * is gone. Throws on failure.
 */
export async function listReferenceMarks(query, limit = 20) {
  let request = supabase
    .from(REFERENCE_MARKS_TABLE)
    .select(
      "id, mark_type, label, image_url, created_at, entity:entities(id, name, entity_type, authority)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  const trimmed = query?.trim();
  if (trimmed) {
    request = request.ilike("label", `%${trimmed.replace(/[%_\\]/g, "")}%`);
  }
  const { data, error } = await request;
  if (error) throw new Error(`Could not load archived marks: ${error.message}`);
  return data ?? [];
}

/**
 * Persists edits to an existing reference mark: label, owning entity, and
 * optionally a replacement image (uploaded to the entity's folder first, so
 * a failed upload never touches the row).
 *
 * A blocked UPDATE surfaces as an explicit error: PostgREST reports an RLS
 * denial as "0 rows affected" rather than a failure, and callers must never
 * show a success that didn't happen.
 */
export async function updateReferenceMark({
  id,
  bucket,
  entityId,
  label,
  file,
}) {
  const patch = {
    entity_id: entityId,
    label: label?.trim() || null,
  };

  if (file) {
    const path = `${entityId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error(
        "Could not resolve a public URL for the replacement image.",
      );
    }
    patch.image_url = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from(REFERENCE_MARKS_TABLE)
    .update(patch)
    .eq("id", id)
    .select("id, entity_id, label, image_url");
  if (error) {
    throw new Error(`Could not update the record: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error(
      "The update was blocked by database security (row-level security). " +
        "Signed-in users need an UPDATE policy on reference_marks for edits to save.",
    );
  }
  return data[0];
}
