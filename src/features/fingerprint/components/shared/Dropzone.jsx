import { useRef, useState } from "react";
import { getDropzoneTone } from "./dropzoneTones";

/**
 * Drag & drop / click-to-browse shell used by the fingerprint pages.
 *
 * The owning page keeps the file itself (via `useImageFile`); this component
 * only owns the interaction: drag visuals, click-to-open, and the hidden
 * file input. The current state (empty or preview) is rendered through
 * `children`, so each page can compose its own empty/preview content out of
 * `DropzoneEmptyState` + `FilePreview`.
 */
export function Dropzone({
  preview,
  onSelect,
  tone = "blue",
  accept = "image/*",
  className = "",
  children,
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const styles = getDropzoneTone(tone);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!preview) fileRef.current?.click();
        }}
        className={`relative border rounded transition-all duration-300 ${
          dragOver ? styles.drag : preview ? styles.preview : styles.idle
        } ${className}`}
      >
        {children}
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
