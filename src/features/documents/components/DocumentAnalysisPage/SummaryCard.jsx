/**
 * Plain-text summary produced by `compare-documents`, explaining the
 * verdict in human terms. Renders nothing when the payload has no summary.
 */
export function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-5">
      <p className="text-[#6B7280] text-[10px] tracking-[0.2em] uppercase mb-3 font-mono">
        Summary
      </p>
      <p className="text-[#8A92A6] text-xs leading-relaxed">{summary}</p>
    </div>
  );
}
