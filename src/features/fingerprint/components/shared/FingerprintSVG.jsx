import { motion } from "motion/react";

/**
 * Fingerprint glyph. `scanning` adds a sweeping scan line; `showMinutiae`
 * overlays detected ridge endings (amber) and bifurcations (green).
 */
export function FingerprintSVG({
  size = 80,
  scanning = false,
  showMinutiae = false,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B89D4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5B89D4" stopOpacity="0.3" />
        </linearGradient>
        {scanning && (
          <linearGradient id="fpScan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B89D4" stopOpacity="0" />
            <stop offset="50%" stopColor="#5B89D4" stopOpacity="1" />
            <stop offset="100%" stopColor="#5B89D4" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      {[18, 26, 34, 42].map((r) => (
        <ellipse
          key={r}
          cx="50"
          cy="55"
          rx={r * 0.75}
          ry={r}
          stroke="url(#fpGrad)"
          strokeWidth="1.2"
        />
      ))}
      <path
        d="M28 38 Q50 20 72 38"
        stroke="url(#fpGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 30 Q50 6 76 30"
        stroke="url(#fpGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {showMinutiae && <MinutiaeOverlay />}
      {scanning ? (
        <motion.rect
          x="0"
          width="100"
          height="12"
          fill="url(#fpScan)"
          initial={{ y: 10 }}
          animate={{ y: 90 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <circle cx="50" cy="55" r="3" fill="#5B89D4" />
      )}
    </svg>
  );
}

const MINUTIAE_POINTS = [
  { x: 36, y: 45, type: "ending" },
  { x: 59, y: 49, type: "bifurcation" },
  { x: 45, y: 66, type: "bifurcation" },
  { x: 63, y: 63, type: "ending" },
  { x: 33, y: 60, type: "bifurcation" },
  { x: 52, y: 36, type: "ending" },
];

/** Decorative ridge-ending / bifurcation markers. */
function MinutiaeOverlay() {
  return (
    <g>
      <line
        x1="36"
        y1="45"
        x2="59"
        y2="49"
        stroke="#5B89D4"
        strokeWidth="0.7"
        strokeDasharray="2 2"
      />
      <line
        x1="45"
        y1="66"
        x2="63"
        y2="63"
        stroke="#5B89D4"
        strokeWidth="0.7"
        strokeDasharray="2 2"
      />
      {MINUTIAE_POINTS.map((point) => {
        const color = point.type === "ending" ? "#F59E0B" : "#10B981";
        return (
          <g key={`${point.x}-${point.y}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4.2"
              fill="none"
              stroke={color}
              strokeWidth="0.9"
            />
            <circle cx={point.x} cy={point.y} r="1.5" fill={color} />
          </g>
        );
      })}
    </g>
  );
}
