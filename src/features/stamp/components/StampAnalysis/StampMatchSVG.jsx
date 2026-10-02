/**
 * Archive-vs-query overlay used on the results step: the database seal rings
 * in solid cyan, the uploaded query as the amber dashed circle, and the
 * matched markers in green.
 */
export function StampMatchSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-42.5 h-auto overflow-hidden"
      fill="none"
      aria-hidden="true"
    >
      {/* Database rings — cyan */}
      <circle cx="100" cy="100" r="82" stroke="#5B89D4" strokeWidth={2} opacity={0.85} />
      <circle
        cx="100"
        cy="100"
        r="56"
        stroke="#5B89D4"
        strokeWidth={1}
        strokeDasharray="5 3"
        opacity={0.5}
      />
      <circle
        cx="100"
        cy="100"
        r="22"
        fill="#5B89D4"
        opacity={0.08}
        stroke="#5B89D4"
        strokeWidth={1.5}
      />
      {/* Radial lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return (
          <line
            key={i}
            x1={100 + 60 * Math.cos(a)}
            y1={100 + 60 * Math.sin(a)}
            x2={100 + 78 * Math.cos(a)}
            y2={100 + 78 * Math.sin(a)}
            stroke="#5B89D4"
            strokeWidth={1.2}
            opacity={0.4}
          />
        );
      })}
      {/* Query overlay — amber dashed */}
      <circle
        cx="102"
        cy="101"
        r="83"
        stroke="#F59E0B"
        strokeWidth={1.5}
        opacity={0.4}
        strokeDasharray="7 3"
      />
      {/* Match markers */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={100 + 82 * Math.cos(a)}
            cy={100 + 82 * Math.sin(a)}
            r="3"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Corner brackets */}
      <path d="M 8 30 L 8 8 L 30 8" stroke="#5B89D4" strokeWidth="1.5" opacity={0.55} strokeLinecap="round" />
      <path d="M 170 8 L 192 8 L 192 30" stroke="#5B89D4" strokeWidth="1.5" opacity={0.55} strokeLinecap="round" />
      <path d="M 8 170 L 8 192 L 30 192" stroke="#5B89D4" strokeWidth="1.5" opacity={0.55} strokeLinecap="round" />
      <path d="M 170 192 L 192 192 L 192 170" stroke="#5B89D4" strokeWidth="1.5" opacity={0.55} strokeLinecap="round" />
    </svg>
  );
}
