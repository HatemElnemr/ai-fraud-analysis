import { FaDatabase, FaShieldAlt } from "react-icons/fa";

/**
 * Archive record card: the record the function matched against, its key
 * fields, and the verdict badge.
 *
 * Every row is read through `normalizeMatchResult`'s safe accessors, so
 * fields the response omits show `—`; when the payload carried no record at
 * all the card says so (`emptyNote`) instead of inventing one. The badge only
 * claims "authenticated" when the score cleared the threshold.
 */
export function ArchiveRecordCard({
  result,
  typeLabel = "Record",
  entityLabel = "Name",
  authorityLabel = "Authority",
  recordType,
  emptyNote = "The comparison returned no archive record for this query.",
}) {
  const record = result.archiveRecord;
  const status = result.status;
  // An inconclusive run returned no record because nothing could be scored —
  // don't tell the user "no match" when no comparison actually completed.
  const note =
    status === "unknown"
      ? "The comparison was inconclusive — no archive record could be confirmed."
      : emptyNote;

  const badge =
    status === "match"
      ? { text: `${typeLabel.toUpperCase()} AUTHENTICATED`, className: "border-[#5B89D4]/20 bg-[#5B89D4]/10", textClass: "text-[#5B89D4]" }
      : status === "no-match"
        ? { text: `${typeLabel.toUpperCase()} NOT VERIFIED`, className: "border-red-500/20 bg-red-500/5", textClass: "text-red-400" }
        : { text: `${typeLabel.toUpperCase()} UNVERIFIED`, className: "border-amber-500/20 bg-amber-500/5", textClass: "text-amber-400" };

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.12)] rounded-lg p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaDatabase size={13} className="text-[#5B89D4]" />
        <span className="text-[#6B7280] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono">
          Archive Record
        </span>
      </div>

      {record ? (
        <>
          <div className="border-b border-[rgba(91,137,212,0.06)] pb-3 mb-4">
            <div className="text-[#4B5563] text-[9px] uppercase tracking-wider mb-1">
              {entityLabel}
            </div>
            <div className="text-[#DDE1EC] text-base font-semibold">
              {record.name ?? "—"}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {buildRows(record, { authorityLabel, recordType }).map((row) => (
              <div
                key={row.k}
                className="flex justify-between items-start gap-2 text-xs"
              >
                <div className="text-[#4B5563] shrink-0">{row.k}</div>
                <div
                  className={`text-right ${row.cyan ? "text-[#5B89D4]" : "text-[#DDE1EC]"} ${row.mono ? "font-mono" : ""}`}
                >
                  {row.v ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-[#6B7280] text-xs leading-relaxed">{note}</p>
      )}

      <div
        className={`mt-5 flex items-center justify-center gap-2 py-2.5 border rounded ${badge.className}`}
      >
        <FaShieldAlt size={13} className={badge.textClass} />
        <span
          className={`${badge.textClass} text-[10px] font-bold tracking-[0.18em]`}
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {badge.text}
        </span>
      </div>
    </div>
  );
}

/** Record rows — fixed order; missing values render as `—`. */
function buildRows(record, { authorityLabel, recordType }) {
  return [
    { k: "Record ID", v: record.id, cyan: true, mono: true },
    // The candidate label ("Youssef Signature") only appears when returned.
    ...(record.label ? [{ k: "Mark Label", v: record.label }] : []),
    { k: authorityLabel, v: record.authority },
    { k: "Type", v: recordType },
  ];
}
