import {
  CyberBtn,
  ErrorBanner,
  InputField,
  SectionHeading,
} from "../../fingerprint/components/FormFields";
import { ENTITY_TYPES, entityTypeLabel } from "../constants";

/**
 * "Entity" card — the required link to an `entities` row.
 *
 * Either typeahead-select an existing entity or create one inline
 * (name + person/organization type, matching the DB check constraint).
 * Expects the object returned by `useEntityPicker`.
 */
export function EntitySection({ picker, namePlaceholder }) {
  const {
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
  } = picker;

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded p-4 sm:p-6">
      <SectionHeading>
        Entity <span className="text-[#5B89D4]">*</span>
      </SectionHeading>

      {entityId && entityInfo ? (
        /* Resolved entity chip */
        <div className="flex items-center justify-between gap-3 border border-[#5B89D4]/30 bg-[#5B89D4]/5 rounded px-3 py-2.5">
          <div className="min-w-0">
            <div className="text-[#DDE1EC] text-xs font-medium truncate">
              {entityInfo.name}
            </div>
            <div
              className="text-[#5B89D4] text-[9px] uppercase tracking-[0.15em] mt-0.5 truncate"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {entityTypeLabel(entityInfo.entity_type)} · {entityId}
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-[10px] uppercase tracking-[0.15em] text-[#4B5563] hover:text-[#5B89D4] underline transition-colors shrink-0"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Change
          </button>
        </div>
      ) : (
        <>
          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            {[
              { k: "select", label: "Select Existing" },
              { k: "create", label: "Create New" },
            ].map((m) => (
              <button
                key={m.k}
                type="button"
                onClick={() => switchMode(m.k)}
                className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border rounded transition-colors ${
                  mode === m.k
                    ? "border-[#5B89D4]/60 bg-[#5B89D4]/10 text-[#5B89D4]"
                    : "border-[rgba(91,137,212,0.15)] text-[#4B5563] hover:text-[#8A92A6]"
                }`}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "select" ? (
            /* ── Existing-entity typeahead ── */
            <div className="flex flex-col gap-2">
              <InputField
                label="Search Entities"
                placeholder="Type a name to search existing entities…"
                value={query}
                onChange={handleQueryChange}
              />
              {searching && (
                <div
                  className="text-[#4B5563] text-[10px]"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  Searching…
                </div>
              )}
              {searchErr && (
                <div className="text-[#EF4444] text-[10px]">
                  Entity search failed: {searchErr}
                </div>
              )}
              {!searching &&
                !searchErr &&
                query.trim() &&
                results.length === 0 && (
                  <div className="text-[#4B5563] text-[10px]">
                    No matching entities — switch to “Create New” to add one.
                  </div>
                )}
              {results.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-[rgba(91,137,212,0.12)] rounded divide-y divide-[rgba(91,137,212,0.06)]">
                  {results.map((entity) => (
                    <button
                      key={entity.id}
                      type="button"
                      onClick={() => select(entity)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-[#5B89D4]/5 transition-colors"
                    >
                      <span className="text-[#DDE1EC] text-xs truncate">
                        {entity.name}
                      </span>
                      <span
                        className="text-[#5B89D4] text-[9px] uppercase shrink-0"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {entityTypeLabel(entity.entity_type)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Inline creation ── */
            <div className="flex flex-col gap-4">
              <InputField
                label="Entity Name"
                placeholder={namePlaceholder}
                value={newEntity.name}
                onChange={(v) => setNewEntity((p) => ({ ...p, name: v }))}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[#6B7280] text-[10px] uppercase tracking-[0.15em] flex items-center gap-1"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  Entity Type <span className="text-[#5B89D4]">*</span>
                </label>
                <div className="flex items-center gap-5 pt-1">
                  {ENTITY_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-2 text-xs cursor-pointer transition-colors ${
                        newEntity.entity_type === type
                          ? "text-[#DDE1EC]"
                          : "text-[#8A92A6] hover:text-[#DDE1EC]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="entityType"
                        checked={newEntity.entity_type === type}
                        onChange={() =>
                          setNewEntity((p) => ({ ...p, entity_type: type }))
                        }
                        className="w-3.5 h-3.5 accent-[#5B89D4] cursor-pointer"
                      />
                      {entityTypeLabel(type)}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <CyberBtn
                  outline
                  onClick={create}
                  disabled={creating || !newEntity.name.trim()}
                >
                  {creating ? "Creating…" : "Create Entity"}
                </CyberBtn>
              </div>
            </div>
          )}
        </>
      )}

      {createErr && (
        <div className="mt-3">
          <ErrorBanner msg={createErr} />
        </div>
      )}
    </div>
  );
}
