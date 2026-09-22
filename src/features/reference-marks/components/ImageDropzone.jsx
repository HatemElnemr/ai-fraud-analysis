import { useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { SectionHeading } from "../../fingerprint/components/FormFields";

/**
 * Image upload card — drag & drop / click-to-browse picker with preview,
 * plus the per-page scanning tips underneath.
 *
 * File validation happens in the parent (`onSelect`); this component only
 * manages the dropzone interaction.
 */
export function ImageDropzone({
  title,
  icon,
  dropText,
  tips = [],
  file,
  preview,
  onSelect,
  onClear,
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded p-4 sm:p-6">
      <SectionHeading>
        {title} <span className="text-[#5B89D4]">*</span>
      </SectionHeading>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => {
          if (!preview) fileRef.current?.click();
        }}
        className={`relative border rounded transition-all duration-300 ${
          dragOver
            ? "border-[#5B89D4] bg-[#5B89D4]/5 shadow-[0_0_30px_rgba(91,137,212,0.1)]"
            : preview
              ? "border-[rgba(91,137,212,0.2)] bg-[#13151F]"
              : "border-dashed border-[rgba(91,137,212,0.14)] bg-[#13151F] cursor-pointer hover:border-[rgba(91,137,212,0.28)]"
        }`}
      >
        {preview ? (
          <div className="p-4 sm:p-5 flex flex-col items-center gap-4">
            <div
              className="w-full rounded border border-[rgba(255,255,255,0.08)] bg-white flex items-center justify-center p-4"
              style={{ minHeight: "140px" }}
            >
              <img
                src={preview}
                alt={`${title} preview`}
                className="max-h-28 sm:max-h-32 max-w-full object-contain"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[#DDE1EC] text-xs font-medium truncate max-w-35 sm:max-w-40">
                  {file?.name}
                </div>
                <div
                  className="text-[#4B5563] text-[10px] mt-0.5"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB · ${file.type.split("/")[1].toUpperCase()}`
                    : ""}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 border border-[#5B89D4]/25 rounded bg-[#5B89D4]/5 shrink-0">
                <FaCheck size={9} className="text-[#5B89D4]" />
                <span
                  className="text-[#5B89D4] text-[9px]"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  READY
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-xs text-[#4B5563] hover:text-[#8A92A6] underline transition-colors"
            >
              Replace image
            </button>
          </div>
        ) : (
          <div className="py-10 sm:py-12 flex flex-col items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded border border-[rgba(91,137,212,0.15)] bg-[#1A1E2D] flex items-center justify-center">
              {icon}
            </div>
            <div className="text-center px-4">
              <div className="text-[#DDE1EC] text-xs font-medium">
                {dropText}
              </div>
              <div className="text-[#6B7280] text-xs mt-0.5">
                or click to browse
              </div>
            </div>
            <div
              className="text-[#374151] text-[8px] uppercase tracking-wider"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              JPG · PNG · TIFF · max 10 MB
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = "";
        }}
      />

      <div className="mt-4 flex flex-col gap-2">
        {tips.map((tip) => (
          <div
            key={tip}
            className="flex items-center gap-2 text-[10px] text-[#4B5563]"
          >
            <div className="w-1 h-1 rounded-full bg-[#5B89D4]/40 shrink-0" />
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
