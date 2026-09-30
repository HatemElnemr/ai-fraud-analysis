/** Right-hand "Record Preview" card listing what will be committed. */
export function RecordPreviewCard({ recordId, fullName, nationality }) {
  const rows = [
    { k: "Record ID", v: recordId || "—", mono: true, cyan: true },
    { k: "Subject", v: fullName || "—", mono: false, cyan: false },
    { k: "Nationality", v: nationality || "—", mono: false, cyan: false },
  ];

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.07)] rounded p-4 sm:p-5">
      <div
        className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-3 sm:mb-4"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Record Preview
      </div>
      <div className="flex flex-col gap-2 sm:gap-2.5">
        {rows.map((row) => (
          <div
            key={row.k}
            className="flex justify-between items-center text-xs py-1.5 border-b border-[rgba(0,240,255,0.04)] last:border-0"
          >
            <span className="text-[#4B5563] shrink-0">{row.k}</span>
            <span
              className={`text-right max-w-[60%] truncate ${
                row.cyan
                  ? "text-[#5B89D4]"
                  : row.v === "—"
                    ? "text-[#374151]"
                    : "text-[#8A92A6]"
              }`}
              style={
                row.mono ? { fontFamily: "JetBrains Mono, monospace" } : {}
              }
            >
              {row.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
