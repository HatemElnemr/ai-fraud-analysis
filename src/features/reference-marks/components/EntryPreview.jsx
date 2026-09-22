import { entityTypeLabel } from "../constants";

/** Live summary of the row that will be inserted. */
export function EntryPreview({ typeLabel, entityInfo, label, fileName }) {
  const rows = [
    { k: "Type", v: typeLabel, cyan: true },
    { k: "Entity", v: entityInfo?.name || "—", cyan: false },
    {
      k: "Entity Type",
      v: entityInfo ? entityTypeLabel(entityInfo.entity_type) : "—",
      cyan: false,
    },
    { k: "Label", v: label || "—", cyan: false },
    { k: "Image", v: fileName || "—", cyan: false },
  ];

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded p-4 sm:p-5">
      <div
        className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-3 sm:mb-4"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Entry Preview
      </div>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.k}
            className="flex justify-between text-xs py-2 border-b border-[rgba(91,137,212,0.04)] last:border-0 gap-2"
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
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {row.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
