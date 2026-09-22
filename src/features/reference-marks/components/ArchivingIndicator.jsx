import { motion } from "motion/react";

/** Spinner + indeterminate progress bar shown while a submission runs. */
export function ArchivingIndicator({ label }) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] rounded bg-[#1A1E2D] py-5 flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border border-[#5B89D4]/30 flex items-center justify-center">
        <motion.div
          className="w-5 h-5 rounded-full border-2 border-transparent border-t-[#5B89D4]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div
        className="text-[#5B89D4] text-xs"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {label}
      </div>
      <div className="w-3/4">
        <div className="h-px bg-[#1E2436] overflow-hidden">
          <motion.div
            className="h-full bg-[#5B89D4]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
