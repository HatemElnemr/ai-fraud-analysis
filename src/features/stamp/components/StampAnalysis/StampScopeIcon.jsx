/** Mark glyph for the "Analysis Scope" card. */
export function StampScopeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="17" stroke="#5B89D4" strokeWidth="2" />
      <circle
        cx="20"
        cy="20"
        r="11"
        stroke="#5B89D4"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity={0.6}
      />
      <circle cx="20" cy="20" r="4" fill="#5B89D4" opacity={0.7} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI * 2) / 8;
        return (
          <line
            key={i}
            x1={20 + 6 * Math.cos(a)}
            y1={20 + 6 * Math.sin(a)}
            x2={20 + 10 * Math.cos(a)}
            y2={20 + 10 * Math.sin(a)}
            stroke="#5B89D4"
            strokeWidth="1.2"
            opacity={0.5}
          />
        );
      })}
    </svg>
  );
}
