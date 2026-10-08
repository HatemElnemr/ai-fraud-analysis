import { motion } from "motion/react";

/**
 * Stylized document illustration used by both document pages: idle on the
 * dropzones/preview panels, with a sweeping scan line when `scanning`.
 */
export function DocumentSVG({ scanning = false, size = 180 }) {
  return (
    <svg viewBox="0 0 160 200" width={size * 0.8} height={size} fill="none">
      <rect
        x="22"
        y="14"
        width="122"
        height="162"
        rx="5"
        stroke="#5B89D4"
        strokeWidth="1"
        opacity={0.18}
      />
      <rect
        x="14"
        y="6"
        width="122"
        height="168"
        rx="5"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.65}
      />
      <path d="M 106 6 L 136 36 L 106 36 Z" fill="#5B89D4" opacity={0.06} />
      <path
        d="M 106 6 L 136 36 L 106 36"
        stroke="#5B89D4"
        strokeWidth="1.2"
        opacity={0.35}
        strokeLinejoin="round"
      />
      <rect x="28" y="22" width="65" height="3" rx="1.5" fill="#5B89D4" opacity={0.55} />
      <rect x="28" y="31" width="45" height="2" rx="1" fill="#5B89D4" opacity={0.28} />
      <line x1="28" y1="41" x2="122" y2="41" stroke="#5B89D4" strokeWidth="0.8" opacity={0.2} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect
          key={i}
          x="28"
          y={51 + i * 11}
          width={i % 4 === 3 ? 55 : i % 4 === 1 ? 88 : i % 4 === 2 ? 70 : 100}
          height="2"
          rx="1"
          fill="#5B89D4"
          opacity={0.12 + i * 0.018}
        />
      ))}
      {scanning && (
        <motion.g
          initial={{ y: 10 }}
          animate={{ y: [10, 170, 10] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        >
          <rect x={14} y={0} width={122} height={2} fill="#5B89D4" opacity={0.85} />
          <rect x={14} y={-6} width={122} height={14} fill="#5B89D4" opacity={0.06} />
        </motion.g>
      )}
      <path d="M 3 28 L 3 6 L 25 6" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 115 6 L 157 6 L 157 28" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 3 152 L 3 174 L 25 174" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
      <path d="M 115 174 L 157 174 L 157 152" stroke="#5B89D4" strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
    </svg>
  );
}
