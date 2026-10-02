import { useEffect, useState } from "react";
import { FaCheck, FaChevronRight, FaSearch } from "react-icons/fa";
import {
  CyberBtn,
  ErrorBanner,
  GridBg,
  SectionHeading,
} from "../../fingerprint/components/shared";
import { listReferenceMarks, updateReferenceMark } from "../api";
import { useEntityPicker } from "../hooks/useEntityPicker";
import {
  ArchivingIndicator,
  EntitySection,
  EntryPreview,
  ImageDropzone,
  MarkDetailsCard,
} from "../components";
import { editorForMarkType } from "../markEditors";
import { entityTypeLabel } from "../constants";

/** List-row badge per mark type — unknown types are flagged, never hidden. */
function typeBadge(markType) {
  if (markType === "signature")
    return {
      text: "Signature",
      className: "border-[#5B89D4]/30 bg-[#5B89D4]/10 text-[#5B89D4]",
    };
  if (markType === "stamp")
    return {
      text: "Stamp",
      className: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]",
    };
  return {
    text: markType || "unknown",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  };
}

/**
 * Edit screen for archived reference marks.
 *
 * Flow: search the archive → pick a mark → **check its `mark_type` first**
 * (`editorForMarkType`) → only then open the matching signature or stamp
 * editor ("the suggestion"), pre-filled from the stored row. A mark whose
 * type isn't recognized never reaches a form; the mismatch is reported
 * instead.
 *
 * Reads (`listReferenceMarks`) and writes (`updateReferenceMark`) live in
 * `../api`; entity reassignment reuses the registry's `useEntityPicker`.
 */
export function MarkEditPage() {
  const picker = useEntityPicker();

  // Select step
  const [query, setQuery] = useState("");
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [listErr, setListErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [typeErr, setTypeErr] = useState("");

  // Edit step
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null); // { imageUrl, at }

  // The mark-type check: runs before any edit form is shown.
  const editor = selected ? editorForMarkType(selected.mark_type) : null;

  /* Debounced archive search (state changes stay in the async callback). */
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const rows = await listReferenceMarks(query);
        if (cancelled) return;
        setMarks(rows);
        setListErr("");
      } catch (error) {
        if (cancelled) return;
        setMarks([]);
        setListErr(error.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSearching(false);
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleQueryChange = (value) => {
    setQuery(value);
    setListErr("");
    setSearching(true);
  };

  const openMark = (mark) => {
    // Check the type FIRST — the form only opens for a known signature/stamp.
    const match = editorForMarkType(mark.mark_type);
    if (!match) {
      setSelected(null);
      setSaved(null);
      setTypeErr(
        `This record is “${mark.mark_type ?? "unknown"}” — neither a signature nor a stamp — so it cannot be edited here.`,
      );
      return;
    }
    setTypeErr("");
    setErr("");
    setSaved(null);
    setLabel(mark.label ?? "");
    setFile(null);
    setPreview(mark.image_url ?? "");
    picker.reset();
    if (mark.entity) picker.select(mark.entity);
    setSelected(mark);
  };

  const backToList = () => {
    setSelected(null);
    setSaved(null);
    setErr("");
    setTypeErr("");
    setFile(null);
    setPreview("");
    setLabel("");
    picker.reset();
  };

  const handleSelect = (nextFile) => {
    if (!nextFile.type.startsWith("image/")) return;
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  };

  const handleClear = () => {
    setFile(null);
    setPreview("");
  };

  const handleSave = async () => {
    if (!selected || !editor) return;
    if (!picker.entityId) {
      setErr("Select an existing entity or create a new one before saving.");
      return;
    }
    setErr("");
    setSaving(true);
    try {
      const updated = await updateReferenceMark({
        id: selected.id,
        bucket: editor.bucket,
        entityId: picker.entityId,
        label,
        file,
      });
      setSaved({ imageUrl: updated.image_url, at: new Date() });
      // Keep the list row in sync with what was just saved.
      try {
        setMarks(await listReferenceMarks(query));
      } catch {
        // A stale list row is cosmetic — never fail the save over it.
      }
    } catch (error) {
      setErr(error.message || "Failed to save the changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13151F] flex flex-col relative">
      <GridBg />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1.5 text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] mb-4 sm:mb-6"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Dashboard <FaChevronRight size={9} />{" "}
            <span className="text-[#5B89D4]">Edit Marks</span>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2
              className="text-[#DDE1EC] text-xl sm:text-2xl font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {selected && editor ? editor.typeLabel : "Edit Archived Marks"}
            </h2>
            <p className="text-[#8A92A6] mt-1.5 text-xs sm:text-sm">
              {selected && editor
                ? `Update the stored ${editor.typeLabel.toLowerCase()} — its type was verified before this form opened.`
                : "Find an archived signature or stamp, verify its type, then edit it."}
            </p>
          </div>

          {/* ── SELECT STEP ── */}
          {!selected && (
            <div className="flex flex-col gap-4">
              {typeErr && <ErrorBanner msg={typeErr} />}

              <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded p-4 sm:p-6">
                <SectionHeading>Search Archive</SectionHeading>
                <div className="relative">
                  <FaSearch
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Filter by mark label…"
                    className="w-full bg-[#13151F] border border-[rgba(0,240,255,0.18)] rounded-sm pl-8 pr-3 py-2.5 sm:py-3 text-[#DDE1EC] text-xs sm:text-sm placeholder:text-[#374151] focus:outline-none focus:border-[#5B89D4]/50 focus:ring-1 focus:ring-[#5B89D4]/10 transition-all"
                  />
                </div>
                <div
                  className="text-[#4B5563] text-[10px] mt-3"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {searching
                    ? "Searching…"
                    : loading
                      ? "Loading archive…"
                      : `${marks.length} mark${marks.length === 1 ? "" : "s"} found`}
                </div>
              </div>

              {listErr && <ErrorBanner msg={listErr} />}

              {!searching && !loading && !listErr && marks.length === 0 && (
                <div className="border border-[rgba(91,137,212,0.12)] rounded p-4 sm:p-6 text-[#6B7280] text-xs">
                  No archived marks match this filter — upload one from the
                  Signature or Stamp registry first.
                </div>
              )}

              <div className="flex flex-col gap-2">
                {marks.map((mark) => {
                  const badge = typeBadge(mark.mark_type);
                  return (
                    <button
                      key={mark.id}
                      type="button"
                      onClick={() => openMark(mark)}
                      className="w-full flex items-center gap-3 sm:gap-4 border border-[rgba(91,137,212,0.12)] rounded px-3 sm:px-4 py-3 text-left hover:border-[#5B89D4]/40 hover:bg-[#5B89D4]/5 transition-colors"
                    >
                      {mark.image_url && (
                        <img
                          src={mark.image_url}
                          alt=""
                          className="w-10 h-10 rounded border border-[rgba(255,255,255,0.08)] bg-white object-contain p-0.5 shrink-0"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="text-[#DDE1EC] text-xs font-medium truncate block">
                          {mark.label || "Untitled mark"}
                        </span>
                        <span className="text-[#4B5563] text-[10px] truncate block mt-0.5">
                          {mark.entity?.name ?? "Unlinked entity"}
                          {mark.entity?.entity_type
                            ? ` · ${entityTypeLabel(mark.entity.entity_type)}`
                            : ""}
                          {mark.entity?.authority
                            ? ` · ${mark.entity.authority}`
                            : ""}
                          {` · ${new Date(mark.created_at).toLocaleDateString()}`}
                        </span>
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-[0.15em] border rounded px-2 py-1 shrink-0 ${badge.className}`}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {badge.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── EDIT STEP (only reachable after the type check passed) ── */}
          {selected && editor && saved && (
            <div className="border border-[#5B89D4]/20 rounded bg-[#1A1E2D] p-6 sm:p-12 flex flex-col items-center gap-6 text-center shadow-[0_0_60px_rgba(91,137,212,0.04)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#5B89D4]/30 bg-[#5B89D4]/8 flex items-center justify-center">
                <FaCheck size={28} className="text-[#5B89D4]" />
              </div>
              <div>
                <div
                  className="text-[#DDE1EC] text-lg sm:text-xl font-bold mb-2"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {editor.successTitle}
                </div>
                <p className="text-[#8A92A6] text-xs sm:text-sm max-w-sm">
                  The {editor.typeLabel.toLowerCase()} for{" "}
                  <span className="text-[#DDE1EC] font-medium">
                    {picker.entityInfo?.name}
                  </span>{" "}
                  has been saved to the archive.
                </p>
              </div>
              <div className="w-full max-w-sm bg-[#13151F] border border-[rgba(91,137,212,0.1)] rounded p-4 sm:p-5 text-left flex flex-col gap-3">
                {[
                  { k: "Type", v: editor.typeLabel },
                  { k: "Entity", v: picker.entityInfo?.name || "—" },
                  {
                    k: "Entity Type",
                    v: picker.entityInfo
                      ? entityTypeLabel(picker.entityInfo.entity_type)
                      : "—",
                  },
                  ...(picker.entityInfo?.authority
                    ? [{ k: "Authority", v: picker.entityInfo.authority }]
                    : []),
                  { k: "Label", v: label || "—" },
                  { k: "Saved at", v: saved.at.toLocaleString() },
                ].map((row) => (
                  <div key={row.k} className="flex justify-between text-xs gap-2">
                    <span className="text-[#4B5563] shrink-0">{row.k}</span>
                    <span
                      className={`truncate max-w-[65%] ${
                        row.k === "Type" || row.k === "Entity"
                          ? "text-[#5B89D4]"
                          : "text-[#DDE1EC]"
                      }`}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
              <CyberBtn onClick={backToList} className="w-full sm:w-auto">
                Edit Another Mark
              </CyberBtn>
            </div>
          )}

          {selected && editor && !saved && (
            <>
              {/* Verified-type banner — visible proof the check happened. */}
              <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 border border-[#5B89D4]/25 bg-[#5B89D4]/5 rounded px-3 py-2.5">
                <span
                  className="text-[#5B89D4] text-[9px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  Mark type verified
                </span>
                <span
                  className="text-[#DDE1EC] text-[9px] uppercase tracking-[0.18em]"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {editor.typeLabel} · {selected.id}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left column: entity + mark details */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <EntitySection
                    picker={picker}
                    namePlaceholder={editor.entityNamePlaceholder}
                    showAuthority={editor.showAuthority}
                    authorityPlaceholder={editor.authorityPlaceholder}
                  />
                  <MarkDetailsCard
                    label={label}
                    onChange={setLabel}
                    placeholder={editor.labelPlaceholder}
                  />
                  {err && <ErrorBanner msg={err} />}
                </div>

                {/* Right column: image + preview + actions */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                  <ImageDropzone
                    title={editor.imageTitle}
                    icon={editor.icon}
                    dropText={editor.dropText}
                    tips={editor.tips}
                    file={file}
                    preview={preview}
                    onSelect={handleSelect}
                    onClear={handleClear}
                  />

                  <EntryPreview
                    typeLabel={editor.typeLabel}
                    entityInfo={picker.entityInfo}
                    label={label}
                    fileName={
                      file?.name ?? (preview ? "current archive image" : "—")
                    }
                  />

                  {saving ? (
                    <ArchivingIndicator label={editor.savingMsg} />
                  ) : (
                    <CyberBtn onClick={handleSave} className="w-full">
                      {editor.saveLabel}
                    </CyberBtn>
                  )}

                  <CyberBtn outline onClick={backToList} className="w-full">
                    Back to Mark List
                  </CyberBtn>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MarkEditPage;
