import { motion } from "motion/react";

/**
 * Metrics grid + verification-threshold progress bar.
 *
 * `result.metrics` is guaranteed to be an array (see `normalizeMatchResult`);
 * rows the function didn't measure render as `—` instead of dropping out or
 * crashing, so a response without metrics still explains what is evaluated.
 */
export function MetricsCard({ result, title = "Analysis Metrics" }) {
  const metrics = result.metrics ?? [];
  const score = result.score ?? 0;
  const isMatch = result.status === "match";
  const barColor =
    result.status === "match"
      ? "#5B89D4"
      : result.status === "no-match"
        ? "#EF4444"
        : "#F59E0B";

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded-lg p-5">
      <div className="text-[#6B7280] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-4 font-mono">
        {title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.k}-${index}`}
            className="bg-[#13151F]/50 p-2.5 rounded border border-[rgba(91,137,212,0.04)]"
          >
            <div className="text-[#4B5563] text-[9px] sm:text-[10px] mb-0.5">
              {metric.k}
            </div>
            <div className="text-[#DDE1EC] text-xs sm:text-sm font-medium font-mono">
              {metric.v ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[rgba(91,137,212,0.06)]">
        <div className="flex justify-between text-[9px] sm:text-[10px] text-[#4B5563] mb-1.5 font-mono">
          <span>Verification threshold — {result.threshold}%</span>
          <span className="text-[#DDE1EC]">
            {result.score === null ? "—" : `${result.score}%`} match
          </span>
        </div>
        <div className="h-1.5 bg-[#1E2436] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isMatch ? "#5B89D4" : barColor }}
            initial={{ width: "0%" }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
