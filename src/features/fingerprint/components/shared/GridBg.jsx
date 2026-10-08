/** Decorative background grid. Hidden on paper — it's screen-only chrome. */
export function GridBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35] print:hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}
