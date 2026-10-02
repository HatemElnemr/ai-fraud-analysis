/**
 * "Session Details" readout — rows are built by the owning page from real
 * values (elapsed time, operator, edge function name); rows without a value
 * are dropped rather than faked.
 */
export function SessionDetailsCard({ title = "Session Details", rows = [] }) {
  const visible = rows.filter(
    (row) => row.v !== null && row.v !== undefined && row.v !== "",
  );
  if (visible.length === 0) return null;

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded-lg p-5">
      <div className="text-[#6B7280] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-3 font-mono">
        {title}
      </div>
      <div className="flex flex-col divide-y divide-[rgba(91,137,212,0.04)]">
        {visible.map((row) => (
          <div
            key={row.k}
            className="flex justify-between items-start text-xs py-2 gap-3"
          >
            <span className="text-[#4B5563] shrink-0">{row.k}</span>
            <span className="text-[#8A92A6] font-mono text-right break-words min-w-0">
              {row.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
