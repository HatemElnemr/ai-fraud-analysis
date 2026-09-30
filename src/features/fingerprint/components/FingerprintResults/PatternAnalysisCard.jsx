import { motion } from "motion/react";

/**
 * Three headline metrics (pattern confidence, hand/finger confidence,
 * similarity score) plus the threshold bar.
 *
 * All values come from the `compare-fingerprint` response — there are no
 * fabricated minutiae counts, so a missing value renders as "—".
 */
export function PatternAnalysisCard({ fingerprintType, result }) {
  const { score, threshold, status } = result;
  const isMatch = status === "match";

  const tiles = [
    {
      label: "Pattern Confidence",
      value: readPercent(fingerprintType?.confidence),
      color: "#F59E0B",
      sub: fingerprintType?.pattern_type ? fingerprintType.pattern_type : "detected",
    },
    {
      label: "Similarity Score",
      value: score === null ? "—" : `${score}`,
      color: "#5B89D4",
      sub: "of 100",
    },
  ];

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded p-4 sm:p-5">
      <div
        className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-4 sm:mb-5"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Biometric Analysis
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="bg-[#13151F]/40 sm:bg-transparent p-3 sm:p-0 rounded border border-[rgba(91,137,212,0.05)] sm:border-0"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tile.color }}
              />
              <span className="text-[#6B7280] text-[10px]">{tile.label}</span>
            </div>
            <div className="flex items-baseline">
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color: tile.color, fontFamily: "JetBrains Mono, monospace" }}
              >
                {tile.value}
              </span>
              <span className="text-[#4B5563] text-xs ml-1.5">{tile.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div
          className="flex justify-between text-[8px] sm:text-[9px] text-[#4B5563] mb-1.5"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <span>Verification threshold — {threshold}%</span>
          <span>{score === null ? "no score" : `${score}% confidence`}</span>
        </div>
        <div className="h-1.5 bg-[#1E2436] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isMatch ? "#5B89D4" : "#EF4444" }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(Math.max(score ?? 0, 0), 100)}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/** `90` → `"90%"`; already a label → kept; missing → "—"`. */
function readPercent(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && value.includes("%")) return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return String(value);
  return `${parsed}%`;
}
