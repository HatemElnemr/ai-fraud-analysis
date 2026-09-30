/**
 * Technical readout for the run: the classification the edge function made
 * (`inputFingerprintType`) and its notes.
 *
 * Rows with no source in the response are omitted rather than faked, and the
 * card disappears entirely when there is nothing to show. `notes` is a
 * paragraph rather than a row so long text wraps instead of being clipped.
 */
export function TechnicalMetadataCard({ fingerprintType }) {
  const pattern = [fingerprintType?.pattern_type, fingerprintType?.subtype]
    .filter(Boolean)
    .join(" · ");
  const notes = fingerprintType?.notes;

  const rows = [
    { k: "Pattern Type", v: pattern },
    { k: "Pattern Confidence", v: percent(fingerprintType?.confidence) },
  ].filter((row) => row.v);

  if (rows.length === 0 && !notes) return null;

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded p-4 sm:p-6">
      <div
        className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-4"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Technical Metadata
      </div>

      {rows.length > 0 && (
        <div className="flex flex-col">
          {rows.map((row) => (
            <div
              key={row.k}
              className="flex justify-between items-start text-xs py-2.5 border-b border-[rgba(91,137,212,0.04)] last:border-0 gap-3"
            >
              <span className="text-[#4B5563] shrink-0">{row.k}</span>
              <span
                className="text-[#8A92A6] text-right break-words min-w-0"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {row.v}
              </span>
            </div>
          ))}
        </div>
      )}

      {notes && (
        <div
          className={`pt-3.5 ${
            rows.length > 0
              ? "mt-1 border-t border-[rgba(91,137,212,0.04)]"
              : ""
          }`}
        >
          <div
            className="text-[#6B7280] text-[9px] uppercase tracking-[0.15em] mb-1.5"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Notes
          </div>
          <p className="text-[#8A92A6] text-[11px] leading-relaxed break-words">
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}

/** `90` → `"90%"`; already a label → kept; missing → null (row hidden). */
function percent(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" && value.includes("%")) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return String(value);
  return `${parsed}%`;
}
