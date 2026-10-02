import { motion } from "motion/react";

/**
 * "Analysis in progress" panel shown while `signature-stamp-match` runs.
 *
 * The mark-specific artwork is passed as `children` (signature strokes, stamp
 * rings). The progress bar loops because the request duration is unknown — it
 * reads as an indeterminate indicator rather than a fixed timer.
 */
export function ScanningState({
  title,
  subtitle,
  status,
  steps = ["Extracting features", "Matching archive"],
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-8">
      <div className="text-center px-4">
        <h2 className="text-[#DDE1EC] text-xl sm:text-2xl font-bold font-sans">
          {title}
        </h2>
        <p className="text-[#8A92A6] mt-1.5 text-xs sm:text-sm">{subtitle}</p>
      </div>

      {children}

      <div className="text-center">
        <div className="text-[#5B89D4] font-bold text-sm sm:text-base font-sans">
          {status}
        </div>
        <div className="text-[#8A92A6] text-xs sm:text-sm mt-1">
          Cross-referencing database records
        </div>
      </div>

      <div className="w-full max-w-xs px-4">
        <div className="h-1 bg-[#1E2436] rounded overflow-hidden">
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
        <div className="flex justify-between mt-2 text-[9px] sm:text-[10px] text-[#4B5563] uppercase tracking-wider font-mono">
          <span>{steps[0]}</span>
          <span>{steps[1]}</span>
        </div>
      </div>
    </div>
  );
}
