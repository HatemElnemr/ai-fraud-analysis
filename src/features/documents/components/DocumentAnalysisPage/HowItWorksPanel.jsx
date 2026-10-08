/**
 * Static "How it works" explainer shown beside the analysis form.
 */
export function HowItWorksPanel() {
  const STEPS = [
    ["01", "Upload your document"],
    ["02", "System searches the library"],
    ["03", "Highest match is selected"],
    ["04", "Differences are extracted"],
    ["05", "Results are displayed"],
  ];

  return (
    <div className="border border-[rgba(91,137,212,0.1)] bg-[#1A1E2D] rounded-lg p-5">
      <p className="text-[#6B7280] text-[10px] tracking-[0.2em] uppercase mb-4 font-mono">
        How it works
      </p>
      {STEPS.map(([n, t]) => (
        <div
          key={n}
          className="flex items-center gap-3 py-2 border-b border-[rgba(91,137,212,0.06)] last:border-0"
        >
          <span className="text-[#5B89D4]/50 text-[10px] w-5 shrink-0 font-mono">
            {n}
          </span>
          <span className="text-[#8A92A6] text-xs">{t}</span>
        </div>
      ))}
    </div>
  );
}
