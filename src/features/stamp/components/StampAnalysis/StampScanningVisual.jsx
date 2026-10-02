import { motion } from "motion/react";

/**
 * Animated radial sweep shown while `signature-stamp-match` processes the
 * query: a rotating wedge over ghosted seal rings.
 */
export function StampScanningVisual() {
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-50 h-auto" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="82" stroke="#5B89D4" strokeWidth={2} opacity={0.22} />
      <circle
        cx="100"
        cy="100"
        r="56"
        stroke="#5B89D4"
        strokeWidth={1}
        strokeDasharray="5 3"
        opacity={0.15}
      />
      <circle cx="100" cy="100" r="22" stroke="#5B89D4" strokeWidth={1.5} opacity={0.18} />
      <motion.g
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <line x1={100} y1={100} x2={100} y2={18} stroke="#5B89D4" strokeWidth={2} opacity={0.9} />
        <path
          d="M 100 100 L 100 18 A 82 82 0 0 1 182 100 Z"
          fill="#5B89D4"
          opacity={0.05}
        />
      </motion.g>
      <path d="M 8 30 L 8 8 L 30 8" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 170 8 L 192 8 L 192 30" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 8 170 L 8 192 L 30 192" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 170 192 L 192 192 L 192 170" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
    </svg>
  );
}
