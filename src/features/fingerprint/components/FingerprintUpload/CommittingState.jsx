import { motion } from "motion/react";
import { FingerprintSVG } from "../shared";

/** Replaces the submit button while the record is being written to Supabase. */
export function CommittingState() {
  return (
    <div className="border border-[rgba(0,240,255,0.12)] rounded bg-[#1A1E2D] py-5 flex flex-col items-center gap-4">
      <FingerprintSVG size={80} scanning />
      <div
        className="text-[#5B89D4] text-xs"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        Committing to Database…
      </div>
      <div className="w-3/4">
        <div className="h-px bg-[#1E2436] overflow-hidden">
          <motion.div
            className="h-full bg-[#5B89D4]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
