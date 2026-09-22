import { supabase } from "../../shared/utils/supabase";
import { ENTITIES_TABLE, REFERENCE_MARKS_TABLE } from "./constants";

/**
 * Typeahead search over `entities` by name.
 * Returns an array of `{ id, name, entity_type }`. Throws on failure.
 */
export async function searchEntities(query, limit = 8) {
  const { data, error } = await supabase
    .from(ENTITIES_TABLE)
    .select("id, name, entity_type")
    .ilike("name", `%${query.replace(/[%_\\]/g, "")}%`)
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw new Error(`Entity search failed: ${error.message}`);
  return data ?? [];
}

/**
 * Insert a row into `entities` and return it as `{ id, name, entity_type }`.
 * Throws on failure.
 */
export async function createEntity({ name, entity_type }) {
  const { data, error } = await supabase
    .from(ENTITIES_TABLE)
    .insert({ name, entity_type })
    .select("id, name, entity_type")
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
