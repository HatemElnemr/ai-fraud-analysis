import { useEffect, useState } from "react";
import { createEntity, searchEntities } from "../api";
import { ENTITY_TYPES } from "../constants";

const EMPTY_NEW_ENTITY = { name: "", entity_type: ENTITY_TYPES[0] };

/**
 * State for the "Entity" section: resolved `entityId` (either selected
 * from existing rows or created inline), the debounced name typeahead,
 * and the inline-creation form.
 *
 * Sync state transitions live in event handlers / async callbacks so the
 * search effect never calls setState synchronously (react-hooks lint).
 */
export function useEntityPicker() {
  const [entityId, setEntityId] = useState(null);
  const [entityInfo, setEntityInfo] = useState(null); // { name, entity_type }
  const [mode, setMode] = useState("select"); // "select" | "create"
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [newEntity, setNewEntity] = useState(EMPTY_NEW_ENTITY);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");

  /* Debounced typeahead against `entities`. */
  useEffect(() => {
    if (mode !== "select") return;
    const q = query.trim();
    if (!q) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const found = await searchEntities(q);
        if (cancelled) return;
        setResults(found);
        setSearchErr("");
      } catch (error) {
        if (cancelled) return;
        setResults([]);
        setSearchErr(error.message);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, mode]);

  const handleQueryChange = (value) => {
    setQuery(value);
    setSearchErr("");
    setResults([]);
    if (!value.trim()) {
      setSearching(false);
      return;
    }
    setSearching(true);
  };

  const select = (entity) => {
    setEntityId(entity.id);
    setEntityInfo({ name: entity.name, entity_type: entity.entity_type });
    setQuery("");
    setResults([]);
    setSearching(false);
    setSearchErr("");
    setCreateErr("");
  };

  const clear = () => {
    setEntityId(null);
    setEntityInfo(null);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setQuery("");
    setResults([]);
    setSearching(false);
    setSearchErr("");
    setCreateErr("");
  };

  const create = async () => {
    const name = newEntity.name.trim();
    if (!name) {
      setCreateErr("Entity name is required.");
      return;
    }
    setCreateErr("");
    setCreating(true);
    try {
      const entity = await createEntity({
        name,
        entity_type: newEntity.entity_type,
      });
      setEntityId(entity.id);
      setEntityInfo({ name: entity.name, entity_type: entity.entity_type });
      setNewEntity(EMPTY_NEW_ENTITY);
    } catch (error) {
      setCreateErr(
        error.message || "Failed to create the entity. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  };

  /** Full reset — used by the page's "Register Another" flow. */
  const reset = () => {
    clear();
    setMode("select");
    setQuery("");
    setResults([]);
    setSearching(false);
    setSearchErr("");
    setNewEntity(EMPTY_NEW_ENTITY);
    setCreateErr("");
  };

  return {
    entityId,
    entityInfo,
    mode,
    switchMode,
    query,
    handleQueryChange,
    results,
    searching,
    searchErr,
    newEntity,
    setNewEntity,
    creating,
    createErr,
    create,
    select,
    clear,
    reset,
  };
}
