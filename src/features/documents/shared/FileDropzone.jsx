import { useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { ACCEPTED_DOC_EXTENSIONS } from "../constants";

/**
 * Drag & drop / click-to-browse shell used by both document pages.
 *
 * The owning page keeps the file itself; this component owns the
 * interaction: drag visuals, the click-to-open hidden file input, and the
 * selected-file chip. Layout tuning (padding, gap) goes through
 * `className`, the resting border through `idleClassName`, and the empty
 * state through `children`, so each page composes its own zone content —
 * the upload page leads with an icon, the analysis page with `DocumentSVG`.
 *
 * When a file is selected the chip shows its name + size; `selectedMeta`
 * swaps the default MIME-type suffix for a status line (e.g. "ready for
 * analysis"), rendered with a check mark when `showCheck` is set.
 */
export function FileDropzone({
  file,
  onSelect,
  accept = ACCEPTED_DOC_EXTENSIONS,
  className = "",
  idleClassName = "border-[rgba(91,137,212,0.2)] hover:border-[rgba(91,137,212,0.4)]",
  leading,
  selectedMeta,
  showCheck = false,
  children,
}) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  const meta = selectedMeta ?? file?.type ?? "Unknown type";

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`mt-4 border-2 border-dashed rounded-lg flex flex-col items-center cursor-pointer transition-all ${
          dragging
            ? "border-[#5B89D4] bg-[#5B89D4]/10"
            : idleClassName
        } ${className}`}
      >
        {leading}
        {file ? (
          <div className="text-center">
            <p className="text-[#DDE1EC] text-sm font-medium">{file.name}</p>
            <p className="text-[#6B7280] text-xs mt-0.5 flex items-center gap-1 justify-center font-mono">
              {showCheck && <FiCheck size={12} className="text-[#10B981]" />}
              {(file.size / 1024).toFixed(0)} KB — {meta}
            </p>
          </div>
        ) : (
          children
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          // Allow re-selecting the same file after a clear/replace.
          e.target.value = "";
        }}
      />
    </>
  );
}
