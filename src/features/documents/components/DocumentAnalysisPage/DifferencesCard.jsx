import { FiCheckCircle } from "react-icons/fi";
import { TbGitCompare } from "react-icons/tb";
import { DiffBlock } from "./DiffBlock";

/**
 * "Differences" card: every delta returned by `compare-documents`, or the
 * integrity-confirmed empty state when the documents are identical.
 */
export function DifferencesCard({ differences }) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TbGitCompare size={13} className="text-[#5B89D4]" />
          <span className="text-[#DDE1EC] text-xs font-semibold uppercase tracking-wider font-mono">
            Differences
          </span>
        </div>
        {differences.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded border border-[#F59E0B]/25 text-[#F59E0B] bg-[#F59E0B]/10 font-mono">
            {differences.length} found
          </span>
        )}
      </div>
      {differences.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-10 h-10 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 flex items-center justify-center">
            <FiCheckCircle size={18} className="text-[#10B981]" />
          </div>
          <div className="text-center">
            <p className="text-[#DDE1EC] text-sm font-medium mb-1">
              Documents are identical
            </p>
            <p className="text-[#4B5563] text-xs font-mono">
              No modifications detected — integrity confirmed
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {differences.map((diff, i) => (
            <DiffBlock key={i} diff={diff} />
          ))}
        </div>
      )}
    </div>
  );
}
