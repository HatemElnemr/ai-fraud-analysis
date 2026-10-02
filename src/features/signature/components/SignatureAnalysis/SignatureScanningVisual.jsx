import { motion } from "motion/react";

/**
 * Animated stroke scan shown while `signature-stamp-match` processes the
 * query: a sweeping line over a ghosted signature outline.
 */
export function SignatureScanningVisual() {
  return (
    <svg
      viewBox="0 0 260 130"
      className="w-full max-w-70 h-auto overflow-hidden"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 20 90 C 38 25, 55 18, 70 68 C 85 110, 96 22, 118 52 C 128 72, 124 98, 148 82 C 162 70, 158 40, 190 60 C 210 73, 224 65, 240 56"
        stroke="#5B89D4"
        strokeWidth={2}
        opacity={0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="20"
        y1="112"
        x2="240"
        y2="112"
        stroke="#5B89D4"
        strokeWidth={1.5}
        opacity={0.08}
        strokeLinecap="round"
      />
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, 280, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      >
        <line
          x1={0}
          y1={8}
          x2={0}
          y2={122}
          stroke="#5B89D4"
          strokeWidth={2}
          opacity={0.85}
        />
        <rect
          x={-10}
          y={8}
          width={20}
          height={114}
          fill="#5B89D4"
          opacity={0.06}
        />
      </motion.g>
      <path
        d="M 5 25 L 5 5 L 25 5"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.5}
        strokeLinecap="round"
      />
      <path
        d="M 235 5 L 255 5 L 255 25"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.5}
        strokeLinecap="round"
      />
      <path
        d="M 5 108 L 5 125 L 25 125"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.5}
        strokeLinecap="round"
      />
      <path
        d="M 235 125 L 255 125 L 255 108"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
