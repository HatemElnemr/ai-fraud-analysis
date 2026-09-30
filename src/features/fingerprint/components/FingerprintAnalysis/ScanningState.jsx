import { motion } from "motion/react";
import { TbFingerprint } from "react-icons/tb";

/**
 * "Analysis in progress" panel shown while `compare-fingerprint` runs.
 *
 * The progress bar loops because the request duration is unknown — it reads
 * as an indeterminate progress indicator rather than a fixed 3.2s timer.
 */
export function ScanningState({
  title = "Analyzing Print...",
  subtitle = "Searching 2,441,872 records via AFIS",
  steps = ["Extracting minutiae", "Matching records"],
}) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] rounded bg-[#1A1E2D] p-6 sm:p-12 flex flex-col items-center gap-6 sm:gap-8">
      <div className="text-[#5B89D4]">
        <TbFingerprint className="w-32 h-32 sm:w-48 sm:h-48 animate-pulse" />
      </div>

      <div className="text-center">
        <div
          className="text-[#5B89D4] text-sm sm:text-base font-bold"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {title}
        </div>
        <div className="text-[#8A92A6] text-xs sm:text-sm mt-1 sm:mt-1.5">
          {subtitle}
        </div>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-px bg-[#1E2436] overflow-hidden">
          <motion.div
            className="h-full bg-[#5B89D4]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
        <div
          className="flex justify-between mt-2 text-[8px] sm:text-[9px] text-[#374151] uppercase tracking-wider"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <span>{steps[0]}</span>
          <span>{steps[1]}</span>
        </div>
      </div>
    </div>
  );
}
