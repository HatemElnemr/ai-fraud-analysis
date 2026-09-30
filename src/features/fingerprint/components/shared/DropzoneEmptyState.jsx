/**
 * Empty-state content for `Dropzone`: icon, call to action copy, and the
 * accepted-formats hint.
 *
 * Render it inside a `Dropzone` when no file has been picked yet.
 */
export function DropzoneEmptyState({
  icon,
  dropText,
  hint,
  formats,
  size = "sm",
}) {
  const box =
    size === "lg"
      ? "py-12 sm:py-16 gap-4 sm:gap-5"
      : "py-8 sm:py-12 gap-3 sm:gap-4";

  return (
    <div className={`${box} flex flex-col items-center px-4`}>
      {icon}
      <div className="text-center">
        <div className="text-[#DDE1EC] text-xs sm:text-sm font-medium">
          {dropText}
        </div>
        <div className="text-[#6B7280] text-xs mt-0.5 sm:mt-1">{hint}</div>
      </div>
      <div
        className="text-[#374151] text-[8px] sm:text-[9px] uppercase tracking-wider text-center"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {formats}
      </div>
    </div>
  );
}
