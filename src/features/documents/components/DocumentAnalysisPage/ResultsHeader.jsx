import { TbGitCompare } from "react-icons/tb";
import { PrintButton } from "../../../../shared/components/PrintButton";

/**
 * Top bar of the results screen: section eyebrow, title, and the reset
 * action that returns to the upload form.
 */
export function ResultsHeader({ onNewAnalysis }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TbGitCompare size={13} className="text-[#5B89D4]" />
          <span className="text-[#5B89D4] text-[10px] tracking-[0.25em] uppercase font-mono">
            Document Analysis
          </span>
        </div>
        <h1 className="text-[#DDE1EC] text-xl font-bold tracking-wide">
          Comparison Results
        </h1>
      </div>
      <div className="self-start sm:self-auto flex items-center gap-2">
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-1.5 text-xs border border-[rgba(91,137,212,0.15)] text-[#8A92A6] hover:text-[#5B89D4] px-3 py-2 rounded transition-colors font-mono"
        >
          New Analysis
        </button>
        {/* Screen-only: prints this result as a white report. */}
        <PrintButton />
      </div>
    </div>
  );
}
