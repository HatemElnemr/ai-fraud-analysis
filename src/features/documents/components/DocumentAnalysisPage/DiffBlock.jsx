import { FiMinus, FiPlus } from "react-icons/fi";

const BADGE_MAP = {
  Modification: {
    label: "Modified",
    color: "text-[#F59E0B] border-[#F59E0B]/25 bg-[#F59E0B]/10",
  },
  Addition: {
    label: "Added",
    color: "text-[#10B981] border-[#10B981]/25 bg-[#10B981]/10",
  },
  Deletion: {
    label: "Removed",
    color: "text-red-400 border-red-400/25 bg-red-400/10",
  },
};

/**
 * A single difference from the payload: the section it belongs to, a type
 * badge, and the original/modified lines rendered as red/green rows.
 */
export function DiffBlock({ diff }) {
  const badge = BADGE_MAP[diff.category] ?? {
    label: diff.category ?? "Formatting",
    color: "text-[#8A92A6] border-[#8A92A6]/25 bg-[#8A92A6]/10",
  };

  return (
    <div className="border border-[rgba(91,137,212,0.1)] bg-[#13151F] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1E2D] border-b border-[rgba(91,137,212,0.08)]">
        <span className="text-[#8A92A6] text-[11px] font-mono font-medium">
          {diff.category}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded border font-mono ${badge.color}`}
        >
          {badge.label}
        </span>
      </div>
      <div>
        {diff.referenceText && (
          <div className="flex">
            <div className="w-6 bg-red-500/10 flex items-start justify-center pt-3 shrink-0">
              <FiMinus size={10} className="text-red-400 mt-0.5" />
            </div>
            <p className="py-3 pr-4 text-xs text-red-300/80 bg-red-500/5 flex-1 leading-relaxed font-mono">
              {diff.referenceText}
            </p>
          </div>
        )}
        {diff.uploadedText && (
          <div className="flex">
            <div className="w-6 bg-[#10B981]/10 flex items-start justify-center pt-3 shrink-0">
              <FiPlus size={10} className="text-[#10B981] mt-0.5" />
            </div>
            <p className="py-3 pr-4 text-xs text-emerald-300/80 bg-[#10B981]/5 flex-1 leading-relaxed font-mono">
              {diff.uploadedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
