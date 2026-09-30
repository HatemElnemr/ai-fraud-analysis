/** Inline error banner. */
export function ErrorBanner({ msg }) {
  return (
    <div className="border border-[#EF4444]/30 bg-[#EF4444]/5 rounded px-4 py-3 text-[#EF4444] text-xs">
      {msg}
    </div>
  );
}
