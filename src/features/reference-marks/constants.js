/** Supabase tables shared by all reference-mark pages. */
export const ENTITIES_TABLE = "entities";
export const REFERENCE_MARKS_TABLE = "reference_marks";

/** Mirrors the DB check constraint on entities.entity_type. */
export const ENTITY_TYPES = ["person", "organization"];

/** Human-readable label for an entities.entity_type value. */
export const entityTypeLabel = (type) =>
  type === "person"
    ? "Person"
    : type === "organization"
      ? "Organization"
      : "—";
