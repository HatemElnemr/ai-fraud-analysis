/** Section heading with the small cyan accent bar. */
export function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-3 bg-[#5B89D4] rounded-sm" />
      <h3
        className="text-[#DDE1EC] text-[11px] uppercase tracking-[0.18em]"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {children}
      </h3>
    </div>
  );
}
