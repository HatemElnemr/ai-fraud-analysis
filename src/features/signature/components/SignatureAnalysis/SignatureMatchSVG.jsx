/**
 * Archive-vs-query overlay used on the results step: the database record in
 * solid cyan, the uploaded query as the amber dashed trace, and the matched
 * anchor points in green.
 */
export function SignatureMatchSVG() {
  return (
    <svg
      viewBox="0 0 200 100"
      className="w-full max-w-50 h-auto overflow-hidden"
      fill="none"
      aria-hidden="true"
    >
      {/* Database record — cyan */}
      <path
        d="M 15 65 C 28 18, 40 12, 52 50 C 64 80, 72 16, 86 38 C 94 54, 90 72, 108 60 C 118 52, 116 30, 138 44 C 152 54, 162 47, 178 40"
        stroke="#5B89D4"
        strokeWidth={2}
        opacity={0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="15"
        y1="82"
        x2="178"
        y2="82"
        stroke="#5B89D4"
        strokeWidth={1.5}
        opacity={0.3}
        strokeLinecap="round"
      />
      {/* Query overlay — amber dashed */}
      <path
        d="M 15 68 C 29 21, 42 15, 54 53 C 65 82, 74 19, 88 41 C 96 56, 92 74, 110 63 C 120 55, 118 33, 140 47 C 154 57, 164 50, 180 43"
        stroke="#F59E0B"
        strokeWidth={1.5}
        opacity={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 3"
      />
      {/* Match points */}
      {[
        [52, 50],
        [86, 38],
        [108, 60],
        [138, 44],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="3.5"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <circle cx={x} cy={y} r="1" fill="#10B981" />
        </g>
      ))}
      {/* Corner brackets */}
      <path
        d="M 4 22 L 4 4 L 22 4"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.55}
        strokeLinecap="round"
      />
      <path
        d="M 178 4 L 196 4 L 196 22"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.55}
        strokeLinecap="round"
      />
      <path
        d="M 4 78 L 4 96 L 22 96"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.55}
        strokeLinecap="round"
      />
      <path
        d="M 178 96 L 196 96 L 196 78"
        stroke="#5B89D4"
        strokeWidth="1.5"
        opacity={0.55}
        strokeLinecap="round"
      />
    </svg>
  );
}
