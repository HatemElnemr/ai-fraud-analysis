import { FaCheck } from "react-icons/fa";
import { getDropzoneTone } from "./dropzoneTones";

/**
 * Loaded-file content for `Dropzone`: thumbnail with status badge, file
 * metadata, optional quality checklist, and the clear action.
 *
 * `layout="row"` places the thumbnail beside the details (analysis page),
 * `layout="stack"` stacks them (upload page).
 */
export function FilePreview({
  file,
  preview,
  alt = "File preview",
  badge,
  layout = "row",
  checks = [],
  showType = true,
  onClear,
  clearLabel = "Remove",
  tone = "blue",
}) {
  const styles = getDropzoneTone(tone);
  const isRow = layout === "row";

  const meta = file
    ? `${(file.size / 1024).toFixed(1)} KB${showType && file.type ? ` · ${file.type}` : ""}`
    : "";

  const clearButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      className={`text-xs text-[#4B5563] hover:text-[#8A92A6] underline transition-colors ${
        isRow ? "mt-4" : ""
      }`}
    >
      {clearLabel}
    </button>
  );

  if (isRow) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="relative shrink-0">
          <img
            src={preview}
            alt={alt}
            className={`w-36 h-36 sm:w-44 sm:h-44 object-cover rounded grayscale ${styles.image}`}
          />
          {badge && (
            <div
              className={`absolute top-2 right-2 rounded px-1.5 py-0.5 text-[9px] ${styles.badge}`}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {badge}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
          <div className="text-[#DDE1EC] font-medium truncate text-sm sm:text-base">
            {file?.name}
          </div>
          <div
            className="text-[#6B7280] text-xs mt-1"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {meta}
          </div>

          {checks.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 items-center sm:items-start">
              {checks.map((check) => (
                <div
                  key={check}
                  className="flex items-center gap-2 text-xs text-[#8A92A6]"
                >
                  <FaCheck size={12} className="text-[#5B89D4] shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          )}

          {onClear && clearButton}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 flex flex-col items-center gap-3 sm:gap-4">
      <div className="relative">
        <img
          src={preview}
          alt={alt}
          className={`w-28 h-28 sm:w-36 sm:h-36 object-cover rounded grayscale ${styles.image}`}
        />
        {badge && (
          <div
            className={`absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[8px] ${styles.badge}`}
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {badge}
          </div>
        )}
      </div>

      <div className="text-center w-full px-2">
        <div className="text-[#DDE1EC] text-xs font-medium truncate max-w-45 mx-auto">
          {file?.name}
        </div>
        <div
          className="text-[#4B5563] text-[10px] mt-0.5"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {meta}
        </div>
      </div>

      {onClear && clearButton}
    </div>
  );
}
