import { motion } from "motion/react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

/**
 * Similarity headline: the score, an animated progress bar, and the
 * identical/differences verdict. The score colour bands at 90 (green) and
 * 60 (amber); below that it reads as a failed integrity check (red).
 */
export function ResultScoreBanner({ score, hasDifferences, differenceCount }) {
  const scoreColor =
    score >= 90 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const isMatch = !hasDifferences;

  return (
    <div
      className={`border rounded-lg p-5 mb-6 flex flex-col md:flex-row items-center gap-6 ${
        isMatch
          ? "border-[#10B981]/20 bg-[#10B981]/5"
          : "border-[#F59E0B]/20 bg-[#F59E0B]/5"
      }`}
    >
      <div className="text-center shrink-0">
        <div className="text-4xl font-bold mb-0.5" style={{ color: scoreColor }}>
          {score}%
        </div>
        <p
          className="text-[10px] tracking-[0.15em] uppercase font-mono"
          style={{ color: scoreColor }}
        >
          Similarity
        </p>
      </div>
      <div className="w-full md:flex-1 h-2 bg-[#13151F] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: scoreColor }}
          initial={{ width: "0%" }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {isMatch ? (
          <FiCheckCircle size={18} className="text-[#10B981]" />
        ) : (
          <FiAlertCircle size={18} className="text-[#F59E0B]" />
        )}
        <div>
          <p className="text-[#DDE1EC] text-sm font-semibold">
            {isMatch ? "Identical Match" : "Differences Detected"}
          </p>
          <p className="text-[#6B7280] text-[10px] font-mono">
            {isMatch
              ? "No alterations found"
              : `${differenceCount} difference${differenceCount !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>
    </div>
  );
}
