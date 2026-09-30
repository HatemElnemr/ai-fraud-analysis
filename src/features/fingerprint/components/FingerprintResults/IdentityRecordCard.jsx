import { FaDatabase, FaShieldAlt } from "react-icons/fa";

/**
 * The `person` object returned by `compare-fingerprint`, plus the verdict
 * badge — the badge only claims "verified" when the score cleared the
 * threshold, since the function returns a *closest* record even on a miss.
 */
export function IdentityRecordCard({ person, status }) {
  const isMatch = status === "match";

  const badge = isMatch
    ? { text: "IDENTITY VERIFIED", className: "border-[#5B89D4]/18 bg-[#5B89D4]/5", textClass: "text-[#5B89D4]" }
    : status === "no-match"
      ? { text: "IDENTITY NOT VERIFIED", className: "border-red-500/20 bg-red-500/5", textClass: "text-red-400" }
      : { text: "IDENTITY UNVERIFIED", className: "border-amber-500/20 bg-amber-500/5", textClass: "text-amber-400" };

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.12)] rounded p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <FaDatabase size={12} className="text-[#5B89D4]" />
        <span
          className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          Identity Record
        </span>
      </div>

      {person ? (
        <>
          <div className="border-b border-[rgba(91,137,212,0.06)] pb-4 mb-4">
            <div className="text-[#4B5563] text-[9px] uppercase tracking-wider mb-1">
              Full Name
            </div>
            <div className="text-[#DDE1EC] text-base font-semibold">
              {person.full_name ?? "—"}
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {buildRows(person).map((row) => (
              <div
                key={row.k}
                className="flex justify-between items-start gap-2"
              >
                <div className="text-[#4B5563] text-xs shrink-0">{row.k}</div>
                <div
                  className={`text-right text-xs truncate ${
                    row.cyan ? "text-[#5B89D4]" : "text-[#DDE1EC]"
                  }`}
                  style={
                    row.mono ? { fontFamily: "JetBrains Mono, monospace" } : {}
                  }
                >
                  {row.v}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-[#6B7280] text-xs leading-relaxed">
          The comparison returned no candidate record above the threshold.
        </p>
      )}

      <div
        className={`mt-5 flex items-center justify-center gap-2 py-2.5 border rounded ${badge.className}`}
      >
        <FaShieldAlt size={12} className={badge.textClass} />
        <span
          className={`${badge.textClass} text-[9px] font-bold tracking-[0.18em]`}
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {badge.text}
        </span>
      </div>
    </div>
  );
}

/** Rows for the record card — only fields that actually have a value. */
function buildRows(person) {
  const rows = [
    { k: "Record ID", v: person.id, mono: true, cyan: true },
    { k: "Nationality", v: person.nationality },
    { k: "Registered", v: formatDate(person.created_at) },
    { k: "Email", v: person.email },
    { k: "Clearance Level", v: person.clearance_level ?? person.clearanceLevel },
  ];

  return rows.filter((row) => row.v !== null && row.v !== undefined && row.v !== "");
}

/** ISO timestamp → local date/time; unparseable → "—"`. */
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}
